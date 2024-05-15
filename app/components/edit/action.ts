"use server"
import { PrismaClient } from "@prisma/client";
import { cookies } from 'next/headers'
import { headers } from 'next/headers'

export const Edit = async (formData:FormData) => {
    const data = formData.get("data")
    const title = formData.get("title")
    const docId = formData.get("docId")

    const prisma = new PrismaClient({})
    console.log(headers())
    let contributionPayload: any = {
        ip: headers().get("x-forwarded-for"),
        doc: {
            connect: {
                id: docId
            }
        }
    }
    if (cookies().get("auth")) {
        contributionPayload = {
            ...contributionPayload,
            author: {
                connect: {
                    id: "abc"//change
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
    }else {

    }
}

export const Delete = async () => {

}