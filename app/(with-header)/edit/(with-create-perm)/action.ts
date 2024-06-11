"use server"
import prisma from "@/app/lib/prisma"
import { Verify } from "@/app/lib/turnstile"
import { headers } from "next/headers"
import { disassembleHangul,getChosung } from "es-hangul"

export const Create = async (prevState: any, formData: FormData) => {
    const title = formData.get("title")?.toString()
    const data = formData.get("data")
    const cf_tk = formData.get("cf-turnstile-response")?.toString()

    let user = headers().get("x-user-id")
    let ip = headers().get("x-forwarded-for")
    let verified = await Verify(cf_tk ?? "", process.env.TURNSTILE_KEY ?? "")

    if (!verified) {
        return {
            success: false,
            message: "오류: CAPTCHA 검증에 실패했습니다."
        }
    }

    const { createPermission } = await prisma.user.findFirst({
        where: {
            id: user
        },
        select: {
            createPermission: true
        }
    })

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
    try{
        const {id} = await prisma.doc.create({
            data: {
                id: title,
                title: title,
                content: data,
                title_dis: disassembleHangul(title),
                chosung:getChosung(title),
                subject: {
                    connect: {
                        id: '지구과학'
                    }
                },
                contributions: {
                    create: {
                        before: "",
                        after: data,
                        author: {
                            connect: {
                                id: user
                            }
                        },
                        ip: ip
                    }
                }
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
    }catch(e) {
        console.log(e)
        return {
            success: false,
            message: "문서를 만들지 못했습니다. 제목이 중복되었나요?"
        }
    }

}