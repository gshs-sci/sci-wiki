"use server"
import { disassembleHangul,getChosung } from "es-hangul"
import prisma from "@/app/lib/prisma"
import { createClient } from 'redis';

export const TitleSearch = async(query:string) => {
    if(query=="") {
        return []
    }
    const res = await prisma.doc.findMany({
        where:{
                title_dis:{contains:disassembleHangul(query)}
        },
        select:{
            title:true,
            id:true
        },
        take: 10
    })
    return res
}