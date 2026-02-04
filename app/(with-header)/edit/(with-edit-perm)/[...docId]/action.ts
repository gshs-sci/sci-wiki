"use server"
import prisma from "@/app/lib/prisma";
import { headers } from 'next/headers'
import { Verify } from "@/app/lib/turnstile";
import { createHash } from "crypto";
import { checkDelete, checkEdit,checkAdmin } from "@/app/lib/permission";
import { disassembleHangul, getChosung } from "es-hangul"
import { Prisma } from "@/prisma/generated/prisma/client";

const DeleteEmptySubject = async (subjectId: any, tagsId: any) => {
    await prisma.$transaction([
        prisma.subject.deleteMany({
            where: {
                id: subjectId,
                doc: { none: {} }
            }
        }),
        prisma.tag.deleteMany({
            where: {
                id: { in: tagsId },
                doc: { none: {} }
            }
        })
    ])
}

export const Edit = async (prevState: any, formData: FormData) => {
    const data = formData.get("data")?.toString()
    const docId = formData.get("docId") as string
    const category = formData.get("cat") as string
    const cf_tk = formData.get("cf-turnstile-response")?.toString()
    const commitmsg = formData.get("commitmsg")?.toString()
    const usertags = formData.getAll("tags")

    const pin = (formData.get("pin") as string) == "on"
    const editPermAdmin = (formData.get("editPermAdmin") as string) == "on"

    let verified = await Verify(cf_tk ?? "", process.env.TURNSTILE_KEY ?? "")
    if (!verified) {
        return {
            success: false,
            message: "오류: CAPTCHA 검증에 실패했습니다."
        }
    }
    if (!docId) {
        return {
            success: false,
            message: "오류: 올바르지 않은 문서 아이디입니다."
        }
    }
    let contributionPayload: any = {
        ip: headers().get("x-forwarded-for"),
        doc: {
            connect: {
                id: docId
            }
        }
    }
    let uid = headers().get("x-user-id")
    if (!await checkEdit(uid)) {
        return {
            success: false,
            message: "오류: 권한이 없습니다."
        }
    }
    let isAdmin = await checkAdmin(uid)
    if (uid) {
        contributionPayload = {
            ...contributionPayload,
            author: {
                connect: {
                    id: uid
                }
            }
        }
    }
    const docData = await prisma.doc.findFirst({
        where: {
            id: docId
        },
        select: {
            content: true,
            subject: {
                select: {
                    id: true
                }
            },
            tags: {
                select: {
                    id: true
                }
            },
            pinned:true,
            adminEditable:true
        }
    })
    if(docData?.adminEditable && !isAdmin) {
        return {
            success: false,
            message: "오류: 권한이 없습니다"
        }
    }
    if (docData === null) {
        return {
            success: false,
            message: "오류: 존재하지 않는 문서입니다"
        }
    }

    if (createHash('sha256').update(docData.content).digest('hex') == createHash('sha256').update(data ?? "").digest('hex')
        &&
        category == docData.subject.id
        &&
        (usertags.length == docData.tags.length || usertags.every(e => docData.tags.map(q => q.id).indexOf(e as string) != -1))
        &&
        docData.pinned == pin
        &&
        docData.adminEditable == editPermAdmin
    )
        return {
            success: false,
            message: "오류: 변경사항이 존재하지 않습니다"
        }
    try {
        const permissionPayload = isAdmin?{
            pinned:pin,
            adminEditable:editPermAdmin
        }:{}
        const subjectres = await prisma.$transaction([
            prisma.doc.findFirst({
                where: {
                    id: docId
                },
                select: {
                    subject: {
                        select: {
                            id: true
                        }
                    },
                    tags: {
                        select: {
                            id: true
                        }
                    }
                }
            }),
            prisma.contribution.create({
                data: {
                    note: commitmsg,
                    ...contributionPayload,
                    before: docData.content,
                    after: data
                }
            }),
            prisma.doc.update({
                where: {
                    id: docId
                },
                data: {
                    content: data,
                    subject: {
                        connectOrCreate: {
                            where: {
                                id: category
                            },
                            create: {
                                id: category
                            }
                        }
                    },
                    tags: {
                        set: [],
                        connectOrCreate: usertags.map((elem) => {
                            return {
                                where: {
                                    id: elem,
                                },
                                create: {
                                    id: elem,
                                    id_dis: disassembleHangul(elem as string),
                                    chosung: getChosung(elem as string)
                                }
                            }
                        }) as Array<Prisma.TagCreateOrConnectWithoutDocInput>
                    },
                    ...permissionPayload
                }
            })
        ])
        if (!subjectres[0] || !subjectres[0].subject || !subjectres[0].tags ) {
            return {
                success: false,
                message: "존재하지 않습니다"
            }
        }
        const [{ subject, tags }] = subjectres
        await DeleteEmptySubject(subject.id, tags.map((e: any) => e.id))
    } catch (e) {
        return {
            success: false,
            message: "오류가 발생했습니다"
        }
    }
    return {
        success: true,
        message: "문서를 수정했습니다"
    }
}

export const Delete = async (id: string, cf_tk: string) => {
    if (!id) {
        return {
            success: false,
            message: "Invalid ID"
        }
    }
    let verified = await Verify(cf_tk ?? "", process.env.TURNSTILE_KEY ?? "")
    if (!verified) {
        return {
            success: false,
            message: "오류: CAPTCHA 검증에 실패했습니다."
        }
    }
    let uid = headers().get("x-user-id")
    const deletePermission = await checkDelete(uid)
    if (!deletePermission) {
        return {
            success: false,
            message: "오류: 권한이 없습니다."
        }
    }
    try {
        const { title, subject, tags } = await prisma.doc.delete({
            where: {
                id: id
            },
            select: {
                title: true,
                subject: {
                    select: {
                        id: true
                    }
                },
                tags: {
                    select: {
                        id: true
                    }
                }
            },
        })
        await DeleteEmptySubject(subject.id, tags.map((e: any) => e.id))
        if (title) {
            return {
                success: true,
                message: "문서를 삭제했습니다."
            }
        }
    } catch (e) {
        return {
            success: false,
            message: "문서를 삭제하지 못했습니다."
        }
    }

}