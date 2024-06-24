"use server"
import prisma from "@/app/lib/prisma";
import { cookies } from 'next/headers'
import { headers } from 'next/headers'
import { Verify } from "@/app/lib/turnstile";
import { createHash } from "crypto";
import { checkDelete,checkEdit } from "@/app/lib/permission";

export const Edit = async (prevState: any, formData: FormData) => {
    const data = formData.get("data")?.toString()
    const docId = formData.get("docId")
    const category = formData.get("cat")
    const cf_tk = formData.get("cf-turnstile-response")?.toString()
    const commitmsg = formData.get("commitmsg")?.toString()

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
    if(!await checkEdit(uid)) {
        return {
            success: false,
            message: "오류: 권한이 없습니다."
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
    const docData = await prisma.doc.findFirst({
        where: {
            id: docId
        },
        select: {
            content: true,
            subject:{
                select:{
                    id:true
                }
            }
            
        }
    })  
    if(docData===null){
        return {
            success: false,
            message: "오류: 존재하지 않는 문서입니다"
        }
    }

    if (createHash('sha256').update(docData.content).digest('hex') == createHash('sha256').update(data ?? "").digest('hex') 
        && 
        category == docData.subject.id
    
    )
        return {
            success: false,
            message: "오류: 변경사항이 존재하지 않습니다"
        }
    try{
        await prisma.$transaction([
            prisma.contribution.create({
                data: {
                    note:commitmsg,
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
                    subject:{
                        connect:{
                            id:category
                        }
                    }
                }
            })
        ])
    }catch(e) {
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
        const { title } = await prisma.doc.delete({
            where: {
                id: id
            },
            select: {
                title: true
            },
        })
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