"use client"
import styled from "styled-components";
import { useFormStatus, useFormState } from "react-dom";
import { useEffect, useState } from "react";
import Turnstile, { useTurnstile } from "react-turnstile";
import { Create } from "./action";
import { Textarea } from "@/app/components/edit/editor";
import { useSearchParams } from "next/navigation";
import { Category } from "@/app/components/edit/category/category";
import { Tags } from "@/app/components/edit/tags/tags";
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
        color: var(--color-link);
        margin-left: 5px;
        text-decoration: none;
    }
`
const SubmitBtn = styled.button`
    padding: 7px 10px;
    border-radius: 3px;
    border: none;
    background-color: var(--color-button-background);
    color: var(--color-button-text);
    cursor: pointer;
    font-size: 13px;
`

const SubmitButton = (props: { isSuccess?: boolean, message?: string }) => {
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
                    {pending ? "저장중.." : isVerified?"변경사항 적용하기":"잠시만 기다려 주세요.."}
                </SubmitBtn>
                <Msg>
                    {props.message ? props.message : ""}
                </Msg>
            </LBtn>

        </>
    )
}

const Holder = styled.div`
    margin-left: auto;
    margin-right: auto;
    width: var(--cont-width);
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 51px);
    min-height: 100vh;
`
const TitleInput = styled.input`
    font-size: 2em;
    font-weight: bold;
    margin: 20px 0px;
    border: none;
    border: solid 1px var(--color-border-primary);
    background-color: transparent;
    padding: 5px;
    color: var(--color-font-primary);
    border-radius: 3px;
`

export default function Document() {
    const params = useSearchParams()
    const title:any=typeof params.get("where") == "string"?params.get("where"):""
    const [state, formAction] = useFormState(Create, null)
    return (
        <Holder>
            <form action={formAction}>
                <TitleInput placeholder="제목을 입력하세요" spellCheck={false} name="title" required defaultValue={title}/>
                <Category isRequired={true} name="cat"/>
                <Tags name="tags"/>
                <Textarea defaultValue="" />
                <BottomBtns>
                    <SubmitButton isSuccess={state?.success} message={state?.message} />
                </BottomBtns>
            </form>
        </Holder>
    )
}