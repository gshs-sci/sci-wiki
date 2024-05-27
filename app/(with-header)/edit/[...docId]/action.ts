"use server"
import prisma from "@/app/lib/prisma";
import { cookies } from 'next/headers'
import { headers } from 'next/headers'
import { Verify } from "@/app/lib/turnstile";
import { createHash } from "crypto";

export const Edit = async (prevState: any,  formData:FormData) => {
    const data = formData.get("data")?.toString()
    const title = formData.get("title")
    const docId = formData.get("docId")
    const cf_tk = formData.get("cf-turnstile-response")?.toString()

    let verified = await Verify(cf_tk??"",process.env.TURNSTILE_KEY??"")
    if(!verified) {
        return {
            success:false,
            message:"오류: CAPTCHA 검증에 실패했습니다."
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
    let uid=headers().get("x-user-id")
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
    if (docId) { //update
        const { content } = await prisma.doc.findFirst({
            where: {
                id: docId
            },
            select: {
                content: true
            }
        })
        if(!content)
            return {
                success:false,
                message:"오류: 존재하지 않는 문서입니다"
            }
        if(createHash('sha256').update(content).digest('hex')==createHash('sha256').update(data??"").digest('hex'))
            return {
                success:false,
                message:"오류: 변경사항이 존재하지 않습니다"
            }
        await prisma.contribution.create({
            data:{
            ...contributionPayload,
            before:content,
            after:data}
        })
        await prisma.doc.update({
            where: {
                id:docId
            },
            data:{
                content:data
            }
        })
        return {
            success:true,
            message:"문서를 수정했습니다."
        }
    }else {

    }
}

export const Delete = async () => {

}