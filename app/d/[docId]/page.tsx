import remarkRehype from "remark-rehype";
import { unified } from "unified";
import remarkParse from "remark-parse";
import rehypeReact from "rehype-react";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import { remarkExtendedTable, extendedTableHandlers } from 'remark-extended-table';

import rehypeSanitize from "rehype-sanitize";
import GithubSlugger from 'github-slugger'

import "./globals.css"
import * as prod from 'react/jsx-runtime'
import { Index } from "@/app/components/doc/index/index";
import { H2Elem, H3Elem, H4Elem, H5Elem, H6Elem } from "@/app/components/doc/titles";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";

interface Title {
    level: number
    text: string
    id: string
    children: Array<Title>
}
const extractTitles = (markdownText: string) => {
    const lines = markdownText.split('\n');
    const titles: Array<Title> = [];
    const slugger = new GithubSlugger();
    let insideCodeBlock = false;
    let insideMathBlock = false;
    const parentIndexes = [0, 0, 0, 0, 0];

    const extractTitle = (level: number, match: RegExpMatchArray) => {
        const title = {
            level,
            text: match[1],
            id: slugger.slug(match[1]),
            children: [],
        };

        let parent = titles;
        for (let i = 1; i < level; i++) {
            const parentIndex = parentIndexes[i - 1];
            parent = parent[parentIndex].children;
        }
        parent.push(title);
        parentIndexes[level - 1] = parent.length - 1;
    };

    for (const line of lines) {
        if (line.startsWith('```')) {
            insideCodeBlock = !insideCodeBlock;
            continue;
        }
        if (line.startsWith('$$')) {
            insideMathBlock = !insideMathBlock;
            continue;
        }

        if (!insideCodeBlock && !insideMathBlock) {
            const levelMatches = [
                line.match(/^##\s(.+)/),
                line.match(/^###\s(.+)/),
                line.match(/^####\s(.+)/),
                line.match(/^#####\s(.+)/),
                line.match(/^######\s(.+)/),
            ];

            for (let level = 1; level <= levelMatches.length; level++) {
                const match = levelMatches[level - 1];
                if (match) {
                    extractTitle(level, match);
                    break;
                }
            }
        }
    }

    return titles;
};

const CompileMD = (data: string): Promise<JSX.Element> => {

    const aElem = (prop: any) => {
        if (!prop["data-footnote-ref"]) {
            return (
                <a {...prop} >{prop.children}</a>
            )
        }
        return (
            <a {...prop} >[{prop.children}]</a>
        )
    }

    const options: any = {
        Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs, components: {
            h2: H2Elem, h3: H3Elem, h4: H4Elem, h5: H5Elem, h6: H6Elem, a: aElem
        }
    }

    return new Promise((resolve, _) => {
        unified()
            .use(remarkParse, { fragment: true })
            .use(remarkMath)
            .use(remarkGfm)
            .use(remarkExtendedTable)
            .use(remarkRehype, {
                handlers: {
                    ...extendedTableHandlers
                }
            })
            .use(rehypeHighlight)
            .use(rehypeSlug)
            .use(rehypeKatex)
            .use(rehypeReact, options)
            .process(data)
            .then((val) => {
                resolve(val.result)
            });
    })

}

const prisma = new PrismaClient({})

export async function generateMetadata({ params }: any) {
    const { title } = await prisma.doc.findFirst({
        where: {
            id: params.docId
        },
        select: {
            title: true
        }
    })
    return {
        title: title + " - SCI"
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
    if (content === null) {
        return notFound()
    }
    const compiled = await CompileMD(content)
    return (
        <>
            <Index titles={extractTitles(content)} />
            <div>
                <h1>{title}</h1>
                {compiled}
            </div>
        </>
    )
}