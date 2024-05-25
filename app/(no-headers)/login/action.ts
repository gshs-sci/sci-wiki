"use server"
import { PrismaClient } from "@prisma/client";
import { Verify } from "@/app/lib/turnstile";
import { createHash } from "crypto";
import { cookies } from 'next/headers'
import * as jose from 'jose'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient({})

export async function Login(prevState: any, formData: FormData) {
    let id = formData.get("id")?.toString().toLowerCase()
    let pw = formData.get("pw")?.toString()
    let cf_token = formData.get("cf-turnstile-response")?.toString()

    if (!process.env.JWT_KEY) {
        throw new Error("JWT_KEY invalid: check .env")
    }

    let verified = await Verify(cf_token ?? "", process.env.TURNSTILE_KEY ?? "")
    if (!verified) {
        return {
            success: false,
            errors: {
                id: " ",
                pw: "CAPTCHA를 검증하지 못했습니다. 새로고침 후 다시 시도해 주세요"
            }
        }
    }
    if (!id || !pw) {
        return {
            success: false,
            errors: {
                id: id ? "" : "아이디를 입력해 주세요",
                pw: pw ? "" : "비밀번호를 입력해 주세요"
            }
        }
    }
    let result = await prisma.user.findFirst({
        where: {
            OR: [
                { email: id },
                { id: id }
            ],
            password: createHash('sha256').update(pw).digest('hex')
        },
        select: {
            id: true
        }
    })
    if (result === null) {
        return {
            success: false,
            errors: {
                id: " ",
                pw: "존재하지 않는 아이디이거나 비밀번호가 일치하지 않습니다"
            }
        }
    }
    const secret = new TextEncoder().encode(process.env.JWT_KEY)

    const JWT = await new jose.SignJWT({ uid: result.id })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1d')
        .sign(secret)

    cookies().set("auth", JWT)
    redirect("/")

}