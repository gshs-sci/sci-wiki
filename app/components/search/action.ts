"use server"
import { disassembleHangul,getChosung } from "es-hangul"
import prisma from "@/app/lib/prisma"

export const TitleSearch = async(query:string) => {
    if(query=="") {
        return {
            success:true,
            data:[]
        }
    }
    const res = await prisma.doc.findMany({
        where:{
            OR:[
                {title_dis:{contains:disassembleHangul(query)}},
                {chosung:{contains:getChosung(query)}}
            ]
        },
        select:{
            title:true,
            id:true
        },
        take: 10
    })
    return {
        success:true,
        data:res
    }
}