"use server"

import prisma from "@/app/lib/prisma"
import { createClient } from "redis"
import { createHash } from "crypto";

import { client } from "@/app/lib/redis";
export async function ResetPW(prevState: any, formData: FormData) {
    const pw = formData.get("pw")?.toString()
    const code = formData.get("code")?.toString()


    const email = await client.get("resetcode:"+code)
    if(!email) {
        return {
            success:false,
            errors:{pw:"코드가 만료되었습니다"}
        }
    }
    if(!pw || pw.length<8) {
        return {
            success:false,
            errors:{pw:"조건에 맞지 않는 비밀번호입니다"}
        }
    }
    const res = await prisma.user.findFirst({
        where:{
            email:email
        },
        select:{
            id:true
        }
    })
    if(!res) {
        return {
            success:false,
        }
    }
    const {id} = res
    await client.del("resetcode:"+code)
    await client.del("resetemail:" + email)
    await prisma.user.update({
        where:{
            id:id
        },
        data:{
            password:createHash('sha256').update(pw).digest('hex')
        }
    })
    return {
        success:true
    }
}