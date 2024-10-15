"use server"
import { disassembleHangul,getChosung } from "es-hangul"
import prisma from "@/app/lib/prisma"
import { createClient } from 'redis';

export const TitleSearch = async(query:string) => {
    if(query=="") {
        return []
    }
    const res = await prisma.$queryRaw`
    SELECT title, id 
    FROM Doc 
    WHERE title_dis LIKE ${disassembleHangul(query) + '%'} 
    ORDER BY title_dis ASC 
    LIMIT 10
    `;
    return res
}