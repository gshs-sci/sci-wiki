import prisma from "@/app/lib/prisma";
import { ManageUser } from "./user";
import { Menu } from "../leftmenu"

export default async function UserControlPage({
    searchParams,
}: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    let cursor
    let where={}
    let forward = true
    let search=""
    if(typeof searchParams?.search=="string") {
        search=searchParams?.search
    }
    if(searchParams?.search) {
        where = {
            OR: [{
                email: {
                    contains: search
                }
            },
            {
                id: {
                    contains: search
                }
            }]
        }
    }
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
    let data = await prisma.user.findMany({
        orderBy: {
            id: "desc"
        },
        select: {
            id: true,            
            email:true,
            registered:true,
            deletePermission:true,
            createPermission:true,
            editPermission:true,
            isAdmin:true
        },
        where:where,
        take: forward ? 20 : -20,
        ...cursor
    })
    let next, prev
    if (data.length < 1) {
        [next, prev] = [null, null]
    } else {
        [next, prev] = await prisma.$transaction([
            prisma.user.findFirst({
                orderBy: {
                    id: "desc"
                },
                select: {
                    id: true,
                },
                where:where,
                take: 1,
                skip: 1,
                cursor: {
                    id: data.slice(-1)[0].id
                }
            }),
            prisma.user.findFirst({
                orderBy: {
                    id: "desc"
                },
                select: {
                    id: true,
                },
                where:where,
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
            <Menu activeKey="user" />
            <ManageUser users={data} forward={next!=null} backward={prev!=null} search={search}/>
        </>
    )
}