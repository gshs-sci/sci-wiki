"use server"
import prisma from "@/app/lib/prisma"
import { Verify } from "@/app/lib/turnstile"
import { headers } from "next/headers"
import { disassembleHangul, getChosung } from "es-hangul"
import { checkCreate,checkAdmin } from "@/app/lib/permission"

export const Create = async (prevState: any, formData: FormData) => {
    const title = formData.get("title")?.toString()
    const data = formData.get("data")
    const category = formData.get("cat")
    const cf_tk = formData.get("cf-turnstile-response")?.toString()
    const usertags = formData.getAll("tags")

    const pin = (formData.get("pin") as string) == "on"
    const editPermAdmin = (formData.get("editPermAdmin") as string) == "on"

    let user = headers().get("x-user-id")
    let ip = headers().get("x-forwarded-for")
    let verified = await Verify(cf_tk ?? "", process.env.TURNSTILE_KEY ?? "")

    if (!verified) {
        return {
            success: false,
            message: "오류: CAPTCHA 검증에 실패했습니다."
        }
    }

    const createPermission = await checkCreate(user)
    let isAdmin = await checkAdmin(user)

    if (!createPermission) {
        return {
            success: false,
            message: "오류: 권한이 없습니다."
        }
    }

    if (!title) {
        return {
            success: false,
            message: "제목을 입력해 주세요."
        }
    }

    if (!data || typeof data !=="string") {
        return {
            success: false,
            message: "본문을 입력해 주세요."
        }
    }
    if(!category || typeof category !=="string") {
        return {
            success: false,
            message: "대분류를 선택해 주세요"
        }
    }
    let d: any = {}
    if (user) {
        d = {
            author: {
                connect: {
                    id: user
                }
            },
        }
    }
    try {
        const permissionPayload = isAdmin?{
            pinned:pin,
            adminEditable:editPermAdmin
        }:{}
        const { id } = await prisma.doc.create({
            data: {
                id: encodeURIComponent(title),
                title: title,
                content: data,
                title_dis: disassembleHangul(title),
                chosung: getChosung(title),
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
                    connectOrCreate: usertags.map((elem)=>{return {
                        where: {
                            id: elem as string,
                        },
                        create: {
                            id: elem as string,
                            id_dis: disassembleHangul(elem as string),
                            chosung: getChosung(elem as string)
                        }
                    }})
                },
                contributions: {
                    create: {
                        before: "",
                        after: data,
                        ...d,
                        ip: ip
                    }
                },
                ...permissionPayload
            },
            select: {
                id: true
            }
        })
        if (!id) {
            return {
                success: false,
                message: "문서를 만들지 못했습니다."
            }
        }
        return {
            success: true,
            message: "문서를 생성했습니다."
        }
    } catch (e) {
        console.log(e)
        return {
            success: false,
            message: "문서를 만들지 못했습니다. 제목이 중복되었나요?"
        }
    }

}