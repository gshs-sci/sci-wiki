"use server"
import prisma from "@/app/lib/prisma"
import * as config from "@/sci-config.json"

export const FetchCategory = async() => {
    const res = await prisma.subject.findMany({
        select:{
            id:true
        }
    })
    return res.map((e:any)=>e.id)
}

export const CreateCategory = async(name:string) => {
    if(name.length<2 || name.length>20){
        return false
    }
    try {
        const res = await prisma.subject.create({
            data:{
                id:name
            },
            select:{
                id:true
            }
        })
        if(res && res.id) {
            return true
        }
    }
    catch(e){}
    return false
}