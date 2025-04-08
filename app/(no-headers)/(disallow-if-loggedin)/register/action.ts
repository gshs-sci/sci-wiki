"use server"
import prisma from "@/app/lib/prisma";
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Resend } from 'resend';
import { createClient } from 'redis';
import { createHash } from "crypto";
import { Verify } from "@/app/lib/turnstile";

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

    let email = formData.get("email")?.toString().trim().replaceAll(/\s/g, '')
    let id = formData.get("id")?.toString().toLowerCase()
    let pw = formData.get("pw")?.toString()
    let cf_token = formData.get("cf-turnstile-response")?.toString()

    let verified = await Verify(cf_token ?? "", process.env.TURNSTILE_KEY ?? "")
    if (!verified) {
        return {
            "success": false,
            errors: {
                email: "CAPTCHA를 검증하지 못했습니다. 새로고침 후 다시 시도해 주세요",
            }
        }
    }
    if (!email || !id || !pw || pw.length < 8) {
        return {
            "success": false,
            errors: {
                id: id ? "" : "아이디를 입력해 주세요",
                email: email ? "" : "이메일을 입력해 주세요",
                pw: !pw || pw.length >= 8 ? "비밀번호를 입력해 주세요" : "비밀번호는 8글자 이상이어야 합니다"
            }
        }
    }
    if (!(/^[a-zA-Z0-9_,-]*$/.test(id))) {
        return {
            "success": false,
            errors: {
                id: "허용되지 않는 문자가 포함되어 있습니다."
            }
        }
    }

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
            errors: {
                id: "이미 가입되어 있는 아이디입니다."
            }
        }
    }
    let mailrecord = await prisma.user.findFirst({
        where: {
            email: email
        },
        select: {
            id: true
        }
    })
    if (mailrecord != null) {
        return {
            "success": false,
            errors: {
                email: "이미 가입되어 있는 이메일입니다."
            }
        }
    }
    if (await client.get("mailp:" + email) != null) {
        return {
            "success": false,
            errors: {
                email: "이미 가입중인 이메일입니다. 10분 후에 다시 시도해 주세요."
            }
        }
    }
    let code = Math.floor(Math.random() * 100000).toString().padStart(5, '0')
    let registerCode = Math.random().toString(36).slice(2, 16);
    try {
        await resend.emails.send({
            from: 'no-reply <noreply@sciwiki.org>',
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
    } catch (_) {
        return {
            "success": false,
            errors: {
                email: "이메일을 보내지 못했습니다. 주소를 다시 확인해 주세요"
            }
        }
    }
    await client.set("mailp:" + email, code, { EX: 600 });
    await client.set("idp:" + id, 0, { EX: 600 });
    await client.set(registerCode, JSON.stringify({
        mail: email,
        id: id,
        pw: createHash('sha256').update(pw).digest('hex')
    }), { EX: 600 });
    cookies().set("reg-key", registerCode)
    redirect("/register/validate")

}