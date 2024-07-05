import prisma from "@/app/lib/prisma";
import { SearchResult } from "./search";
import removeMd from "remove-markdown"
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";

export default async function Page({
    params,
    searchParams,
}: {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {

    if (!searchParams || typeof searchParams["q"] !== "string" || !searchParams["q"]) {
        return redirect("/")
    }
    let where:Prisma.DocWhereInput
    const query = searchParams["q"]
    const subject = searchParams["s"] as string
    const page = searchParams["page"]
    let parsedpage=0
    if(page && !isNaN(page as any)) {
        parsedpage=parseInt(page as any)
    }
    const resultPerPage=20

    if (typeof searchParams["s"] !== "string" || searchParams["s"] == "") {
        where = {
            OR: [{
                content: {
                    contains: query,
                }
            },
            {
                title: {
                    contains: query,
                }
            }]
        }
    } else {
        where = {
            subject: {
                id: subject
            },
            OR: [{
                content: {
                    contains: query,
                }
            },
            {
                title: {
                    contains: query,
                }
            }]
        }
    }
    const [res, count, cats] = await prisma.$transaction([
        prisma.doc.findMany({
            where: where,
            skip:resultPerPage*parsedpage,
            select: {
                title: true,
                id: true,
                content: true,
                subject: {
                    select: {
                        id: true
                    }
                },
                lastUpdated: true,
            },
            take: resultPerPage
        }),
        prisma.doc.count({ where: where }),
        prisma.subject.findMany(
            {
                select: {
                    id: true
                }
            }
        )
    ])
    let returnData = res.map((elem: any) => {
        const { content, ...data } = elem
        return {
            preview: removeMd(content).slice(0, 100),
            ...data
        }
    })
    return (
        <SearchResult page={parsedpage} query={query} count={count} cat={cats} activecat={subject} data={returnData} />
    )
}