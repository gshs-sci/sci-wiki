"use server"
import prisma from "@/app/lib/prisma"
import { Resend } from 'resend';
import { createClient } from 'redis';
import { randomBytes } from "crypto";

if (!process.env.RESEND_KEY) {
    throw new Error("No resend api key provided, terminating..")
}
const resend = new Resend(process.env.RESEND_KEY);

export async function RequestPwReset(prevState: any, formData: FormData) {
    const client = await createClient({
        url: 'redis://redis:6379'
    })
        .on('error', err => console.log('Redis Client Error', err))
        .connect();

    let email = formData.get("email")?.toString().trim()
    const storedcode = await client.get("resetemail:"+email)
    if(!email) {
        return {
            success: false,
            message:"올바르지 않은 이메일 주소입니다"
        }
    }
    if(storedcode) {
        return {
            success: false,
            message:"초기화 메일은 10분에 한번씩 보낼 수 있습니다"
        }
    }
    const queryResult = await prisma.user.findFirst({
        where:{
            email:email
        },
        select:{
            email:true
        }
    })
    if(queryResult) {
        const buffer = randomBytes(48)
        const code = buffer.toString('hex')
        await resend.emails.send({
            from: 'no-reply <noreply@gggg.ws>',
            to: [queryResult.email],
            subject: '[SCI wiki]: 비밀번호 초기화',
            text: `비밀번호를 초기화하려면 다음 링크를 클릭하세요. 링크는 10분 후 만료됩니다. 본인이 비밀번호 초기화를 요청하지 않았다면 이 메일은 무시해도 됩니다. https://sciwiki.org/resetpw/${code}`,
            attachments: [],
            tags: [
                {
                    name: 'category',
                    value: 'reset_email',
                },
            ],
        });
        await client.set("resetcode:" + code, email, { EX: 600 });
        await client.set("resetemail:" + email, code, { EX: 600 });
    }
    return {
        success: true,
        message:"메일을 전송했습니다"
    }
}