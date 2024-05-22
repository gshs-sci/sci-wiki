"use server"
import { PrismaClient } from "@prisma/client";
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Resend } from 'resend';
import { createClient } from 'redis';
import { createHash } from "crypto";

if (!process.env.RESEND_KEY) {
    throw new Error("No resend api key provided, terminating..")
}
const resend = new Resend(process.env.RESEND_KEY);

export async function Register(prevState: any, formData: FormData) {
    const client = await createClient({
        url: 'redis://redis:6379'
    })
        .on('error', err => console.log('Redis Client Error', err))
        .connect();

    const email = formData.get("email")?.toString()
    const id = formData.get("id")?.toString().toLowerCase()
    const pw = formData.get("pw")?.toString()
    const pwre = formData.get("pwre")?.toString()
    if (!email || !id || !pw || pw.length < 8) {
        return {
            "success": false,
            "message": "failed",
            errors: {
                id: id ? "" : "아이디를 입력해 주세요",
                email: email ? "" : "이메일을 입력해 주세요",
                pw: !pw || pw.length >= 8 ? "비밀번호를 입력해 주세요" : "비밀번호는 8글자 이상이어야 합니다"
            }
        }
    }
    if(pw!==pwre) {
        return {
            "success": false,
            "message": "failed",
            errors: {
                pwre: "비밀번호가 일치하지 않습니다"
            }
        }
    }
    const prisma = new PrismaClient({})
    let record = await prisma.user.findFirst({
        where: {
            id: id
        },
        select: {
            id: true
        }
    })
    if (record != null || await client.get("idp:" + id) != null) {
        return {
            "success": false,
            "message": "*이 표시된 입력란은 필수입니다",
            errors: {
                id: "이미 가입되어 있는 아이디입니다"
            }
        }
    }
    if (await client.get("mailp:" + email) != null) {
        return {
            "success": false,
            "message": "가입에 실패했습니다",
            errors: {
                email: "이미 가입중인 이메일입니다. 10분 후에 다시 시도해 주세요"
            }
        }
    }
    let code = Math.floor(Math.random() * 100000).toString().padStart(5, '0')
    let registerCode = Math.random().toString(36).slice(2, 16);
    try {
        await resend.emails.send({
            from: 'no-reply <noreply@gggg.ws>',
            to: [email],
            subject: '[SCI wiki]: 인증번호',
            text: `인증번호는 ${code} 입니다. 본 코드는 10분 후 만료됩니다.`,
            attachments: [],
            tags: [
                {
                    name: 'category',
                    value: 'verifiction_mail',
                },
            ],
        });
    } catch (e) {
        console.log(e)
        return {
            "success": false,
            "message": "가입에 실패했습니다",
            errors: {
                email: "이메일을 보내지 못했습니다. 주소를 다시 확인해 주세요"
            }
        }
    }
    await client.set("mailp:" + email, code, { EX: 600 });
    await client.set("idp:" + id, "true", { EX: 600 });
    await client.set(registerCode, JSON.stringify({
        mail: email,
        id: id,
        pw: createHash('sha256').update(pw).digest('hex')
    }), { EX: 600 });
    cookies().set("reg-key", registerCode)
    redirect("/register/validate")

}