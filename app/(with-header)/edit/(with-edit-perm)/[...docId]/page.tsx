"use server"
import prisma from "@/app/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { EditArea } from "./editArea";
import { headers } from "next/headers";
import { CompileMD } from "@/app/lib/document/compileMd";
import { checkDelete, checkEdit } from "@/app/lib/permission";

export async function generateMetadata({ params }: any) {
    const data = await prisma.doc.findFirst({
        where: {
            id: decodeURIComponent(params.docId.join("/"))
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
            id: decodeURIComponent(params.docId.join("/"))
        },
        select: {
            content: true,
            title: true,
            subject:{
                select:{
                    id:true
                }
            }
        }
    })
    if (data === null) {
        return notFound()
    }
    const { content, title,...other }=data

    let user = headers().get("x-user-id")
    let ip = headers().get("x-forwarded-for")
    const editPerm = await checkEdit(user)
    if(!editPerm) {
        redirect("/")
    }
    const deletePerm = await checkDelete(user)
    const precompile = await CompileMD(content)
    return (
        <>
            <EditArea category={other.subject.id} title={title} content={content} docId={params.docId.join("/")} deletePerm={deletePerm} preCompile={precompile} user={user} ip={!user?ip!:undefined}/>
        </>
    )
}