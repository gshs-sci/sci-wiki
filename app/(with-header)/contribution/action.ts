"use server"
import prisma from "@/app/lib/prisma"
import { Verify } from "@/app/lib/turnstile"
import { headers } from "next/headers"
import { checkEdit } from "@/app/lib/permission"
import { createHash } from "crypto";

export const ReviseDoc = async (docId: string, revId: string, cf_tk: string) => {
    let verified = await Verify(cf_tk ?? "", process.env.TURNSTILE_KEY ?? "")
    if (!verified) {
        return {
            success: false,
            message: "CAPTCHA 검증에 실패했습니다"
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
            message: "권한이 없습니다"
        }
    }
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

    const datares = await prisma.$transaction(
        [
            prisma.contribution.findFirst({
                where: {
                    id: revId
                },
                select: {
                    after: true
                }
            }),
            prisma.doc.findFirst({
                where: {
                    id: docId
                },
                select: {
                    content: true
                }
            }),
        ]
    )

    if (!datares[0] || !datares[0].after || !datares[1] || !datares[1].content ) {
        return {
            success: false,
            message: "존재하지 않습니다"
        }
    }

    const [{after}, {content}] = datares

    if(createHash('sha256').update(after).digest('hex') == createHash('sha256').update(content).digest('hex'))  {
        return {
            success: false,
            message: "변경사항이 존재하지 않습니다"
        }
    }
    await prisma.$transaction([
        prisma.doc.update({
            where: {
                id: docId
            },
            data: {
                content: after
            }
        }),
        prisma.contribution.create({
            data: {
                note: `리비전 ${revId}로 되돌림`,
                ...contributionPayload,
                before: content,
                after: after
            }
        })
    ])
    return {
        success: true,
        message: "문서를 되돌렸습니다"
    }

}