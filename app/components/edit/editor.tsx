"use client"
import styled from "styled-components";
import { Edit } from "../../(with-header)/edit/(with-edit-perm)/[...docId]/action";

import MDEditor from '@uiw/react-md-editor';
import * as commands from "@uiw/react-md-editor/commands"

import { useState, useEffect } from "react";
import { useFormStatus, useFormState } from "react-dom";
import katex from 'katex';
import 'katex/dist/katex.css';
import { H2Elem, H3Elem, H4Elem, H5Elem, H6Elem, SectionElem, AElem } from "@/app/components/doc/txt";

import remarkRehype from "remark-rehype";
import remarkGfm from "remark-gfm";
import { remarkExtendedTable, extendedTableHandlers } from 'remark-extended-table';
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import { getCodeString } from 'rehype-rewrite';
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

import { Noto_Sans_KR } from "next/font/google";
import "@/app/(with-header)/d/[...docId]/globals.css"

const sansNormal = Noto_Sans_KR({ subsets: ["latin"] })

export const Textarea = (props: { defaultValue: string}) => {
    const [value, setValue] = useState<any>(props.defaultValue)

    return (
        <>
                <MDEditor value={value} onChange={setValue}
                    textareaProps={{ name: "data" }}
                    height={"calc(100vh - 210px)"}
                    style={{ fontFamily: sansNormal.style.fontFamily }}
                    commands={[
                        commands.group([commands.title2, commands.title3, commands.title4, commands.title5, commands.title6], {
                            name: 'title',
                            groupName: 'title',
                            buttonProps: { 'aria-label': 'Insert title' }
                        }),
                        commands.bold,
                        commands.italic,
                        commands.strikethrough,
                        commands.divider,
                        commands.link,
                        commands.code,
                        commands.orderedListCommand,
                        commands.unorderedListCommand,
                        commands.divider,
                        commands.codeBlock,
                        commands.table,
                        commands.image,
                    ]}
                    previewOptions={{
                        remarkPlugins: [
                            [remarkGfm],
                            [remarkExtendedTable],
                            [remarkRehype, { clobberPrefix: "uc-", handlers: { ...extendedTableHandlers } }]],
                        rehypePlugins: [[rehypeSanitize, {
                            ...defaultSchema,
                            clobberPrefix: "sci-",
                            attributes: {
                                ...defaultSchema.attributes,
                                code: [
                                    ...(defaultSchema?.attributes?.code || []),
                                    ['className', 'language-*']
                                ],
                                'th': [
                                    'colspan', 'rowspan'
                                ],
                                'td': [
                                    'colspan', 'rowspan'
                                ]
                            }
                        }], [rehypeSlug], [rehypeHighlight, { plainText: ['KaTeX', 'katex', 'KATEX'] }]],
                        components: {
                            code: ({ children = [], className, ...props }) => {
                                if (typeof children === 'string' && /^\$\$(.*)\$\$/.test(children)) {
                                    const html = katex.renderToString(children.replace(/^\$\$(.*)\$\$/, '$1'), {
                                        throwOnError: false,
                                    });
                                    return <code dangerouslySetInnerHTML={{ __html: html }} style={{ background: 'transparent', display: "inline", padding: 0 }} />;
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
                                    return <code dangerouslySetInnerHTML={{ __html: html }} />;
                                }
                                return <code className={String(className)}>{children}</code>;
                            },
                            h2: H2Elem,
                            h3: H3Elem,
                            h4: H4Elem,
                            h5: H5Elem,
                            h6: H6Elem,
                            a: AElem,
                            section: SectionElem
                        },
                    }}
                />
        </>
    )
}