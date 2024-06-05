import "@/app/lib/document/highlight.css"
import "@/app/lib/document/doc.css"
import { Index } from "@/app/components/doc/index/index";
import prisma from "@/app/lib/prisma";
import { notFound } from "next/navigation";

import 'katex/dist/katex.css';
import { extractTitles,CompileMD } from "@/app/lib/document/compileMd";


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
        title: title + " - SCI"
    }
}

export default async function Document({ params }: { params: { docId: Array<string> } }) {
    const data = await prisma.doc.findFirst({
        where: {
            id: decodeURIComponent(params.docId.join("/"))
        },
        select: {
            content: true,
            title: true
        }
    })
    if (data === null) {
        return notFound()
    }
    const { content, title } = data
    const compiled = await CompileMD(content)
    return (
        <>
            <Index titles={extractTitles(content)} />
            <div className="md_doc">
                <h1>{title}</h1>
                {compiled}
            </div>
        </>
    )
}