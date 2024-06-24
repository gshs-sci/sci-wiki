"use server"
import { createClient } from 'redis';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import prisma from "@/app/lib/prisma";

interface Reg {
    mail: String
    id: String
    pw: String
}
export async function Validate(prevState: any, formData: FormData) {
    const client = await createClient({
        url: 'redis://redis:6379'
    }).on('error', err => console.log('Redis Client Error', err))
        .connect();
    const key = cookies().get("reg-key")
    if (!key) {
        redirect("/register")
    }
    let regDatad = await client.get(key.value)
    if (!regDatad) {
        redirect("/register")
    }
    let regData = JSON.parse(regDatad) as Reg
    const code = formData.get("code")
    let tried = await client.get("idp:" + regData["id"])
    if(tried==null) {
        return
    }
    if(parseInt(tried)>5) {
        return {
            success: false,
            errors: {
                code: "시도 가능 횟수를 초과했습니다. 10분 후 다시 시도해 주세요"
            }
        }
    }
    const serverCode = await client.get("mailp:" + regData["mail"])
    if (code !== serverCode) {
        await client.incr("idp:" + regData["id"])
        return {
            success: false,
            errors: {
                code: "인증번호가 일치하지 않습니다."
            }
        }
    }

    let deletePerm = false
    let createPerm = false

    try {
        await client.del("mailp:" + regData["mail"])
        await client.del("idp:" + regData["id"])
        await client.del(key.value)
        await prisma.user.create({
            data: {
                id: regData["id"],
                email: regData["mail"],
                password: regData["pw"],
                deletePermission: deletePerm,
                createPermission: createPerm,
            },
        })
    } catch (e) {
        console.log(e)
        return {
            success: false,
            errors: {
                code: "오류가 발생했습니다."
            }
        }
    }

    redirect("/login")
}