"use server"
import prisma from "@/app/lib/prisma"

export const FetchCategory = async() => {
    const res = await prisma.subject.findMany({
        select:{
            id:true
        }
    })
    return res.map((e:any)=>e.id)
}