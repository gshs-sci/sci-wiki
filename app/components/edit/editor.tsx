"use client"
import MDEditor from '@uiw/react-md-editor';
import * as commands from "@uiw/react-md-editor/commands"

import { useState, useEffect } from "react";
import 'katex/dist/katex.css';
import { Noto_Sans_KR } from "next/font/google";

import "@/app/lib/document/highlight.css"
import "@/app/lib/document/doc.css"

import { CompileMD } from "@/app/lib/document/compileMd";
import styled from 'styled-components';
import { SetStateAction } from 'react';
import { fileUpload } from './upload';

const sansNormal = Noto_Sans_KR({ subsets: ["latin"] })

const insertToTextArea = (insertString: string) => {
    const textarea = document.querySelector('textarea');
    if (!textarea) {
      return null;
    }
  
    let sentence = textarea.value;
    const len = sentence.length;
    const pos = textarea.selectionStart;
    const end = textarea.selectionEnd;
  
    const front = sentence.slice(0, pos);
    const back = sentence.slice(pos, len);
  
    sentence = front + insertString + back;
  
    textarea.value = sentence;
    textarea.selectionEnd = end + insertString.length;
  
    return sentence;
  };


const upload = async(file:File) => {
    const form = new FormData()
    form.append('file',file)
    const result = await fileUpload(form)
    if(result.success) {
        return result.url
    }
}
const onImagePasted = async (dataTransfer: DataTransfer, setMarkdown: (value: SetStateAction<string | undefined>) => void, setLoading: (value: SetStateAction<boolean>) => void) => {
    const files: File[] = [];
    for (let index = 0; index < dataTransfer.items.length; index += 1) {
      const file = dataTransfer.files.item(index);
  
      if (file) {
        files.push(file);
      }
    }
    if(files.length>10) return
    setLoading(true)
    await Promise.all(
      files.map(async (file) => {
        if(["jpeg","png","jpg","gif"].indexOf(file.name.split(".").pop()!)!==-1) {
            const url = await upload(file);
            const insertedMarkdown = insertToTextArea(`![${file.name}](${url})\n`);
            if (!insertedMarkdown) {
              return;
            }
            setMarkdown(insertedMarkdown);
        }
      }),
    );
    setLoading(false)
  };

const Loader = styled.div`
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0,0,0,.6);
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 30;
`

export const Textarea = (props: { defaultValue: string, preCompiled?:JSX.Element }) => {
    const [value, setValue] = useState<any>(props.defaultValue)
    const [uploading,setUploading] = useState(false)
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
        {uploading?<Loader />:<></>}
            <MDEditor value={value} onChange={setValue}
                textareaProps={{ name: "data" }}
                height={"calc(100vh - 210px)"}
                style={{ fontFamily: sansNormal.style.fontFamily, "--color-canvas-default":"var(--color-background)"} as any}
                preview="edit"
                commands={[]}
                onPaste={async (event) => {
                    if(event.clipboardData.files.length>0) {
                        event.preventDefault()
                        await onImagePasted(event.clipboardData, setValue, setUploading);
                    }
                  }}
                  onDrop={async (event) => {

                    event.preventDefault()
                    await onImagePasted(event.dataTransfer, setValue, setUploading);
                  }}
                components={{
                    preview: Previewer
                }}
                visibleDragbar={false}
            />
        </>
    )
}