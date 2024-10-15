"use server"
import { disassembleHangul, getChosung } from "es-hangul"
import prisma from "@/app/lib/prisma"

export const FetchTags = async (query: string) => {
    const res = await prisma.tag.findMany({
        select: {
            id: true
        },
        where: {
            id_dis: { contains: disassembleHangul(query) }
        },
        take: 10
    })
    return res.map((e: any) => e.id)
}