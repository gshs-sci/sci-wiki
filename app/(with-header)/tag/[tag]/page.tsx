import prisma from "@/app/lib/prisma";
import { Tags } from "./tag";
import { notFound } from "next/navigation";

export default async function TagPage({
    params,
    searchParams,
}: {
    params: { tag: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    try{
        let {tag} = params
        tag = decodeURIComponent(tag)
    
        const result = await prisma.tag.findFirst({
            where:{
                id:tag
            },
            select:{
                doc:{
                    orderBy: { 
                        title_dis: 'asc',
                      },
                    select:{
                        id:true,
                        title:true,
                        chosung:true
                    }
                }
            }
        })
        const {doc} = result
    
        return (
            <Tags docs={doc} tag={tag}/>
        )
    }catch(e) {
        return notFound()
    }

}