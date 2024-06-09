import prisma from "@/app/lib/prisma";
import { SearchResult } from "./search";
import removeMd from "remove-markdown"

export default async function Page({
    params,
    searchParams,
}: {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {

    if (!searchParams || typeof searchParams["q"] !== "string") {
        return (
            <>
                검색어 입력부탁
            </>
        )
    }
    let where
    let cat
    const query = searchParams["q"]
    const subject = searchParams["s"]

    if (typeof searchParams["s"] !== "string" || searchParams["s"] == "") {
        cat = ""
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
        cat = subject
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
            select: {
                title: true,
                id: true,
                content: true,
                subject: {
                    select: {
                        id: true
                    }
                },
                lastUpdated: true
            }
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
        <SearchResult query={query} count={count} cat={cats} activecat={cat} data={returnData} />
    )
}