import "@/app/lib/document/highlight.css"
import "@/app/lib/document/doc.css"
import { Index } from "@/app/components/doc/index/index";
import prisma from "@/app/lib/prisma";
import { notFound, redirect } from "next/navigation";
import 'katex/dist/katex.css';
import { extractTitles, CompileMD } from "@/app/lib/document/compileMd";
import { Banner,Title } from "@/app/components/doc/component";
import Link from "next/link";
export async function generateMetadata({ params, searchParams }: any) {
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

export default async function Document({ params, searchParams }: { params: { docId: Array<string> }, searchParams?: { [key: string]: string | string[] | undefined } }) {
    const rev = searchParams!["rev"]
    let data
    if (rev) {
        let contData = await prisma.contribution.findFirst({
            where: {
                id: rev,
                doc: {
                    id: decodeURIComponent(params.docId.join("/"))
                }
            },
            select: {
                after: true,
                doc: {
                    select: {
                        title: true
                    }
                }
            }
        })
        if (contData === null) {
            return redirect("/d/" + decodeURIComponent(params.docId.join("/")))
        }
        data = {
            content: contData.after,
            title: contData.doc.title
        }
    } else {
        data = await prisma.doc.findFirst({
            where: {
                id: decodeURIComponent(params.docId.join("/"))
            },
            select: {
                content: true,
                title: true
            }
        })
    }
    if (data === null) {
        return notFound()
    }
    const { content, title } = data
    const compiled = await CompileMD(content)
    return (
        <>
            <Index titles={extractTitles(content)} />
            <div className="md_doc">
            {rev ? <Banner>주의: 이 문서의 이전 리비전({rev})을 보고 있습니다. <Link href={"/d/" + decodeURIComponent(params.docId.join("/"))} scroll={false}>최신 버전 보기</Link></Banner>:<></>}
                <Title>
                <h1>{title}</h1>
                <div>
                <Link href={"/edit/" + decodeURIComponent(params.docId.join("/"))} scroll={false}>[편집]</Link>
                <Link href={"/contribution/doc/" + decodeURIComponent(params.docId.join("/"))} scroll={false}>[편집 기록]</Link>
                </div>
                </Title>
                {compiled}
            </div>
        </>
    )
}