import remarkRehype from "remark-rehype";
import { unified } from "unified";
import remarkParse from "remark-parse";
import rehypeReact from "rehype-react";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { getCodeString } from 'rehype-rewrite';
import { remarkExtendedTable, extendedTableHandlers } from 'remark-extended-table';
import rehypeSanitize,{defaultSchema} from "rehype-sanitize";
import GithubSlugger from 'github-slugger'

import "./globals.css"
import "./highlight.css"
import * as prod from 'react/jsx-runtime'
import { Index } from "@/app/components/doc/index/index";
import { H2Elem, H3Elem, H4Elem, H5Elem, H6Elem, AElem,SectionElem } from "@/app/components/doc/txt";
import prisma from "@/app/lib/prisma";
import { notFound } from "next/navigation";

import katex from 'katex';
import 'katex/dist/katex.css';

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

    const options: any = {
        Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs, components: {
            h2: H2Elem, h3: H3Elem, h4: H4Elem, h5: H5Elem, h6: H6Elem, a: AElem,section:SectionElem,
            code: ({ children = [], className, ...props }: any) => {
                if (typeof children === 'string' && /^\$\$(.*)\$\$/.test(children)) {
                    const html = katex.renderToString(children.replace(/^\$\$(.*)\$\$/, '$1'), {
                        throwOnError: false,
                    });
                    return <code dangerouslySetInnerHTML={{ __html: html }} style={{ background: 'transparent',display:"inline",padding:0 }} />;
                }
                const code = props.node && props.node.children ? getCodeString(props.node.children) : children;
                if (
                    typeof code === 'string' &&
                    typeof className === 'string' &&
                    /^language-katex/.test(className.toLocaleLowerCase())
                ) {
                    const html = katex.renderToString(code, {
                        throwOnError: false,
                    });
                    return <code dangerouslySetInnerHTML={{ __html: html }}/>;
                }
                return <code className={String(className)} >{children}</code>;

            },
        }
    }

    return new Promise((resolve, _) => {
        unified()
            .use(remarkParse, { fragment: true })
            .use(remarkGfm)
            .use(remarkExtendedTable)
            .use(remarkRehype, {
                clobberPrefix: "uc-",
                handlers:{
                    ...extendedTableHandlers
                }
            })
            .use(rehypeSanitize, {
                ...defaultSchema,
                clobberPrefix: "sci-",
                attributes: {
                  ...defaultSchema.attributes,
                  code: [
                    ...(defaultSchema?.attributes?.code || []),
                    ['className', 'language-*']
                  ],
                  'th':[
                    'colspan','rowspan'
                  ],
                  'td':[
                    'colspan','rowspan'
                  ]
                }})
            .use(rehypeSlug)
            .use(rehypeHighlight,{plainText: ['KaTeX','katex','KATEX']})
            .use(rehypeReact, options)
            .process(data)
            .then((val) => {
                resolve(val.result)
            });
    })

}


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
        title: title + " - SCI"
    }
}

export default async function Document({ params }: { params: { docId: Array<string> } }) {
    const { content, title } = await prisma.doc.findFirst({
        where: {
            id: params.docId.join("/")
        },
        select: {
            content: true,
            title: true
        }
    })
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