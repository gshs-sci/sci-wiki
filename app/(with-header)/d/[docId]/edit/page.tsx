import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { Textarea } from "@/app/components/edit/editor";
const prisma = new PrismaClient({})
export async function generateMetadata({ params }: any) {
    const data = await prisma.doc.findFirst({
        where: {
            id: params.docId
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

export default async function Document({ params }: { params: { docId: string } }) {
    const { content, title } = await prisma.doc.findFirst({
        where: {
            id: params.docId
        },
        select: {
            content: true,
            title: true
        }
    })
    return (
        <>
            <Textarea defaultValue={content} title={title} id={params.docId}></Textarea>
        </>
    )
}