import { headers } from "next/headers"
import prisma from "@/app/lib/prisma"
import { Recents } from "./recents";

export default async function Page({
    params,
    searchParams,
}: {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    let cursor
    let forward = true
    if (searchParams?.from) {
        cursor = {
            skip: 1,
            cursor: {
                id: searchParams!.from as string
            }
        }
    } else if (searchParams?.until) {
        cursor = {
            skip: 1,
            cursor: {
                id: searchParams!.until as string
            }
        }
        forward = false
    } else {
        cursor = {}
    }
    const data = await prisma.doc.findMany({
        orderBy: {
            lastUpdated: "desc"
        },
        select: {
            title:true,
            id:true,
            lastUpdated:true,
            subject:{
                select:{
                    id:true
                }
            }
        },
        take: forward ? 20 : -20,
        ...cursor
    })
    let next,prev
    if(data.length<1) {
        [next,prev]=[null,null]
    }else {
        [next, prev] = await prisma.$transaction([
            prisma.doc.findFirst({
                orderBy: {
                    lastUpdated: "desc"
                },
                select: {
                    id: true
                },
                take: 1,
                skip: 1,
                cursor: {
                    id: data.slice(-1)[0].id
                }
            }),
            prisma.doc.findFirst({
                orderBy: {
                    lastUpdated: "desc"
                },
                select: {
                    id: true
                },
                take: -1,
                skip: 1,
                cursor: {
                    id: data[0].id
                }
            })
        ])
    }
    return (
        <>
            <Recents docs={data} next={next!==null} prev={prev!==null}/>
        </>
    )
}