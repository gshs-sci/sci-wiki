import { headers } from "next/headers"
import prisma from "@/app/lib/prisma"
import { Contribution } from "../../contribution";
import { TitleH1 } from "../../contribution";

export default async function Page({
    params,
    searchParams,
}: {
    params: { ip: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const ip = params.ip
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
    let where = {
        ip: ip,
        author: null
    }
    let d = await prisma.contribution.findMany({
        orderBy: {
            date: "desc"
        },
        where: where,
        select: {
            id: true,
            ip: true,
            doc: {
                select: { id: true,
                    title:true,
                 }
            },
            before: true,
            after: true,
            date: true,
            note: true,
            author: {
                select: { id: true }
            },
        },
        take: forward ? 20 : -20,
        ...cursor
    })
    const data = d.map((elem: any) => {
        return {
            id: elem.id,
            date: elem.date,
            docId: elem.doc.id,
            ip: elem.ip,
            userId: "",
            lengthDifference: elem.after.length - elem.before.length,
            note: elem.note,
            title:elem.doc.title
        }
    })
    let next, prev
    if (data.length < 1) {
        [next, prev] = [null, null]
    } else {
        [next, prev] = await prisma.$transaction([
            prisma.contribution.findFirst({
                orderBy: {
                    date: "desc"
                },
                where: where,
                select: {
                    id: true
                },
                take: 1,
                skip: 1,
                cursor: {
                    id: data.slice(-1)[0].id
                }
            }),
            prisma.contribution.findFirst({
                orderBy: {
                    date: "desc"
                },
                where: where,
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
            <TitleH1>{ip}의 기여 목록</TitleH1>
            <Contribution data={data} forward={next !== null} backward={prev !== null} />
        </>
    )
}