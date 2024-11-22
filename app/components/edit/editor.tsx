"use client"

import { useState, useEffect } from "react";
import 'katex/dist/katex.css';
import { Noto_Sans_KR } from "next/font/google";

import "@/app/lib/document/highlight.css"
import "@/app/lib/document/doc.css"

import { CompileMD } from "@/app/lib/document/compileMd";
import styled, { keyframes } from 'styled-components';
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
    return result
}
const onImagePasted = async (dataTransfer: DataTransfer, setMarkdown: (value: SetStateAction<string | undefined>) => void, setProgress: (value: SetStateAction<Array<number>>) => void) => {
    const files: File[] = [];
    for (let index = 0; index < dataTransfer.items.length; index += 1) {
      const file = dataTransfer.files.item(index);
  
      if (file) {
        files.push(file);
      }
    }
    if(files.length>10) return
    setProgress([files.length,1])
    await Promise.all(
      files.map(async (file,index) => {
        if(["jpeg","png","jpg","gif"].indexOf(file.name.split(".").pop()!)!==-1) {
            setProgress([files.length,index+1])
            const res = await upload(file);
            let insertedMarkdown
            if(res?.success) {
                insertedMarkdown = insertToTextArea(`![${file.name}](${res.url})\n`);
            }else {
                insertedMarkdown = insertToTextArea(`<!-- 이미지를 업로드하지 못했습니다 사유: ${res.message} -->`)
            }

            if (!insertedMarkdown) {
              return;
            }
            setMarkdown(insertedMarkdown);
        }
      }),
    );
  };

const EditHeader = styled.div`
    width: 100%;
    height: 40px;
    background-color: var(--color-banner-normal);
    display: flex;
    align-items: center;
    border-bottom: solid 1px var(--color-border-secondary);
`
const EditBtns = styled.button<{$isActive?:boolean}>`
&:nth-child(1) {
    margin-left: 8px;
}
    color: ${props=>props.$isActive?"var(--color-font-primary)":"var(--color-font-secondary)"};;
    cursor: pointer;
    border: none;
    background-color: ${props=>props.$isActive?"var(--color-background)":"transparent"};
    border: solid 1px ${props=>props.$isActive?"var(--color-border-primary)":"transparent"};
    padding: 5px 10px;
    border-radius: 5px;
`
const Holder = styled.div`
    border: solid 1px var(--color-border-secondary);
    position: relative;
`

const Text = styled.textarea<{$show:boolean}>`
    width: calc(100% - 20px);
    height: 80vh;
    background-color: transparent;
    display: ${props=>props.$show?"inherit":"none"};
    color: var(--color-font-primary);
    border: none;
    padding: 10px;
    &:focus {
        outline: none;
    }
`
const Footer = styled.div`
    width: calc(100% - 16px);
    height: 30px;
    background-color: var(--color-banner-normal);
    position: sticky;
    bottom: 0;
    border-top: solid 1px var(--color-border-secondary);
    color: var(--color-font-secondary);
    font-size: 12px;
    display: flex;
    align-items: center;
    padding: 0px 8px;
`

const Spin = keyframes`
    0% {
        rotate: 0deg;
    }
    100% {
        rotate: 360deg;
    }
`
const Loading = styled.div`
    border: solid 2px var(--color-font-secondary);
    border-radius: 10px;
    border-bottom: solid 2px transparent;
    width: 10px;
    height: 10px;
    rotate: 0deg;
    animation: ${Spin} 1s ease infinite;
    margin-right: 7px;
`


export const Textarea = (props: { defaultValue: string }) => {
    const [value, setValue] = useState<any>(props.defaultValue)
    const [isPreview, setPreview] = useState(false)
    const [uploading,setUploading] = useState(false)

    const [uploadProgress,setProgress] = useState([0,0])

    const Previewer = (props:{source:string,show:boolean}) => {
        const {source} = props
        const [data,setData] = useState<JSX.Element|undefined>()
        useEffect(()=>{
            CompileMD(source).then((res)=>{
                setData(res)
            })
        },[])
        return <div className="md_doc" style={{padding: "10px",width:"calc(100% - 20px)", display:props.show?"inherit":"none"}}>{data}</div>
    }
    
    return (
        <Holder>
            <EditHeader>    
                <EditBtns type="button" $isActive={!isPreview} onClick={()=>setPreview(false)}>편집</EditBtns>
                <EditBtns type="button" $isActive={isPreview} onClick={()=>setPreview(true)}>미리보기</EditBtns>
            </EditHeader>
            <Previewer source={value} show={isPreview}/>
            <Text value={value} onChange={(e)=>setValue(e.target.value)}
            onDragOver={(e)=>e.preventDefault()}
            name="data"
            $show={!isPreview}
            style={
                { 
                    fontFamily: sansNormal.style.fontFamily, 
                    "--color-canvas-default":"var(--color-background)", 
                    borderRadius:0,
                    "--color-border-default":"var(--color-border-secondary)",
                    boxShadow:"none",
                } as any}
            onPaste={async (event) => {
                if(event.clipboardData.files.length>0) {
                    event.stopPropagation()
                    event.preventDefault()
                    setUploading(true)
                    await onImagePasted(event.clipboardData, setValue, setProgress);
                    setUploading(false)
                }
                }}
                onDrop={async (event) => {

                event.preventDefault()
                setUploading(true)
                await onImagePasted(event.dataTransfer, setValue, setProgress);
                setUploading(false)
                }}
        />
            <Footer>
                {uploading?
                <>
                <Loading />
                이미지를 업로드하고 있습니다({uploadProgress[1]}/{uploadProgress[0]})
                </>
                :"이미지를 붙여넣거나 드래그해 업로드할 수 있습니다."}
            </Footer>
        </Holder>
    )
}