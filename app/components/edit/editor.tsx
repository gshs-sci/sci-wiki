"use client"
import MDEditor from '@uiw/react-md-editor';
import * as commands from "@uiw/react-md-editor/commands"

import { useState, useEffect } from "react";
import 'katex/dist/katex.css';
import { Noto_Sans_KR } from "next/font/google";

import "@/app/lib/document/highlight.css"
import "@/app/lib/document/doc.css"

import { CompileMD } from "@/app/lib/document/compileMd";
const sansNormal = Noto_Sans_KR({ subsets: ["latin"] })

export const Textarea = (props: { defaultValue: string, preCompiled?:JSX.Element }) => {
    const [value, setValue] = useState<any>(props.defaultValue)
    const {preCompiled} = props

    const Previewer = (source:string, state:any, dispatch:any) => {
        const [data,setData] = useState<JSX.Element|undefined>(preCompiled)
        useEffect(()=>{
            CompileMD(source).then((res)=>{
                setData(res)
            })
        },[source]) 
        return <div className="md_doc">{data}</div>
    }
    
    return (
        <>
            <MDEditor value={value} onChange={setValue}
                textareaProps={{ name: "data" }}
                height={"calc(100vh - 210px)"}
                style={{ fontFamily: sansNormal.style.fontFamily }}
                preview="edit"
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
                components={{
                    preview: Previewer
                }}

            />
        </>
    )
}