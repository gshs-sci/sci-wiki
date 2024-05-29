"use server"
import prisma from "@/app/lib/prisma";
import { notFound } from "next/navigation";
import { EditArea } from "./editArea";
import { headers } from "next/headers";

export async function generateMetadata({ params }: any) {
    const data = await prisma.doc.findFirst({
        where: {
            id: params.docId.join("/")
        },
        select: {
            title: true
        }
    })
    if (data === null) {
        return notFound()
    }
    const { title } = data
    return {
        title: "문서 수정: " + title + " - SCI"
    }
}

export default async function Document({ params }: { params: { docId: Array<string> } }) {
    const data = await prisma.doc.findFirst({
        where: {
            id: params.docId.join("/")
        },
        select: {
            content: true,
            title: true
        }
    })
    if (data === null) {
        return notFound()
    }
    const { content, title }=data
    let deletePerm = false
    let user = headers().get("x-user-id")
    if (user) {
        let { deletePermission } = await prisma.user.findFirst({
            where: {
                id: user
            },
            select: {
                deletePermission: true
            }
        })
        deletePerm = deletePermission
    }
    return (
        <>
            <EditArea title={title} content={content} docId={params.docId.join("/")} deletePerm={deletePerm} />
        </>
    )
}