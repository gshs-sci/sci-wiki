"use client"
import styled from "styled-components";
import { Noto_Sans_KR } from "next/font/google";
import { useFormStatus, useFormState } from "react-dom";
import { useEffect, useState } from "react";
import Turnstile, { useTurnstile } from "react-turnstile";
import { Edit } from "./action";
import { Textarea } from "@/app/components/edit/editor";

const BottomBtns = styled.div`
    display: flex;   
    margin-top: 20px;
    justify-content: space-between;
`
const LBtn = styled.div`
    display: flex;
`
const Msg = styled.p`
    margin: 0;
    padding: 0;
    margin-left: 10px;
    display: flex;
    align-items: center;
    font-size: 13px;
    & a{
        color: blue;
        margin-left: 5px;
        text-decoration: none;
    }
`
const SubmitBtn = styled.button`
    padding: 7px 10px;
    border-radius: 3px;
    border: none;
    background-color: #000000;
    color: #fff;
    cursor: pointer;
`
const DelBtn = styled.button`
    background-color: transparent;
    color: #c90000;
    border: none;
    cursor: pointer;
`

export const SubmitButton = (props: { isSuccess?: boolean, message?: string }) => {
    const { pending } = useFormStatus()
    const [isVerified, setVerified] = useState(false)
    const turnstile = useTurnstile()

    useEffect(() => {
        if (!turnstile) return
        if (!pending) {
            setVerified(false)
            turnstile.reset();
        }
    }, [pending, turnstile])
    return (
        <>
                <LBtn>
                    <Turnstile
                        sitekey="0x4AAAAAAAax0WPa0nug6v7L"
                        onVerify={() => setVerified(true)}
                        refreshExpired="auto"
                    />
                    <SubmitBtn type="submit" disabled={pending || !isVerified}>
                        {pending ? "저장중.." : "변경사항 적용하기"}
                    </SubmitBtn>
                    <Msg>
                        {props.message ? props.message : ""}
                    </Msg>
                </LBtn>

        </>
    )
}
export const EditArea = (props:{title:string, content:string, docId:string, deletePerm:boolean}) => {
    const {title,content,docId} = props
    const [state, formAction] = useFormState(Edit, null)
    return (
            <form action={formAction}>
                <h1>{title}</h1>
                <Textarea defaultValue={content} title={title} id={docId}></Textarea>
                <BottomBtns>
                    <SubmitButton isSuccess={state?.success} message={state?.message} />
                    {props.deletePerm?<DelBtn type="button">문서 삭제</DelBtn>:<></>}
                </BottomBtns>
            </form>
    )
}