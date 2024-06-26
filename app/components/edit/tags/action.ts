"use server"
import { disassembleHangul, getChosung } from "es-hangul"
import prisma from "@/app/lib/prisma"

export const FetchTags = async (query: string) => {
    const res = await prisma.tag.findMany({
        select: {
            id: true
        },
        where: {
            OR:[
                {id_dis:{contains:disassembleHangul(query)}},
                {chosung:{contains:getChosung(query)}}
            ]
        },
        take: 10
    })
    return res.map((e: any) => e.id)
}