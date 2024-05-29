"use client"
import styled from "styled-components";
import { Noto_Sans_KR } from "next/font/google";
import { useFormStatus, useFormState } from "react-dom";
import { useEffect, useState, useTransition } from "react";
import Turnstile, { useTurnstile } from "react-turnstile";
import { Edit, Delete } from "./action";
import { Textarea } from "@/app/components/edit/editor";
import Link from "next/link";
const BottomBtns = styled.div`
    display: flex;   
    margin-top: 20px;
    justify-content: space-between;
    position: relative;
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
const DelPrompt = styled.div`
    width: 250px;
    position: absolute;
    right: 0;
    background-color: #fff;
    border: solid 1px rgb(202, 202, 202);
    bottom: 40px;
    padding: 20px;
    z-index: 5;
    display: flex;
    flex-direction: column;
    border-radius: 3px;
    & b {
        font-size: 15px;
    }
    & p {
        font-size: 13px;
        margin: 0;
        padding: 0;
        margin-top: 10px;
        line-height: 17px;
    }
    & p.delres {
        margin: 0;
        color: #a8a8a8;
        margin-top: 10px;
    }
    & button {
        margin-top: 10px;
        border: none;
        border-radius: 3px;
        background-color: #f6f6f6;
        border: solid 1px #e2e2e2;
        color: #c90000;
        padding: 7px 10px;
        font-size: 12px;
        cursor: pointer;
    }
    & button:hover {
        background-color: #c90000;
        border-color: #c90000;
        color: #fff;
    }
`

const SubmitButton = (props: { isSuccess?: boolean, message?: string, deletePerm: boolean, docId: string }) => {
    const { pending } = useFormStatus()
    const [token, setToken] = useState("")
    const turnstile = useTurnstile()
    const [showPrompt, setShowPrompt] = useState(false)
    const [deletePending, startTransition] = useTransition()
    const [deleteResult, setDeleteResult] = useState<any>()

    const deleteDoc = async () => {
        startTransition(async () => {
            const res = await Delete(props.docId, token)
            setDeleteResult(res)
        })
    }
    useEffect(() => {
        if (!turnstile) return
        if (!pending) {
            setToken("")
            turnstile.reset();
        }
    }, [pending])

    useEffect(() => {
        if (!turnstile) return
        if (!deletePending) {
            setToken("")
            turnstile.reset();
        }
    }, [deletePending])

    return (
        <>
            <BottomBtns>
                <LBtn>
                    <Turnstile
                        sitekey="0x4AAAAAAAax0WPa0nug6v7L"
                        onVerify={(tk) => setToken(tk)}
                        refreshExpired="auto"
                    />
                    <SubmitBtn type="submit" disabled={pending || !token}>
                        {pending ? "저장중.." : "변경사항 적용하기"}
                    </SubmitBtn>
                    <Msg>
                        {props.message ? props.message : ""}
                    </Msg>
                </LBtn>
                {props.deletePerm ? <>
                    {showPrompt ? <DelPrompt>
                        <b>정말 삭제하시겠습니까?</b>
                        <p>삭제된 문서는 복구할 수 없습니다. 또한 문서의 수정 기록도 함께 삭제됩니다. </p>
                        <button type="button" onClick={deleteDoc}>예, 문서를 삭제하겠습니다</button>
                        {deleteResult ? <p className="delres">{deleteResult.message}
                            {deleteResult.success ? <Link href="/">홈으로 돌아가기</Link> : <></>}
                        </p> : <></>}
                    </DelPrompt> : <></>}
                    <DelBtn type="button" onClick={() => setShowPrompt(!showPrompt)}>문서 삭제</DelBtn>
                </> : <></>}
            </BottomBtns>

        </>
    )
}

export const EditArea = (props: { title: string, content: string, docId: string, deletePerm: boolean }) => {
    const { title, content, docId } = props
    const [state, formAction] = useFormState(Edit, null)
    return (
        <form action={formAction}>
            <h1>{title}</h1>
            <Textarea defaultValue={content}></Textarea>
            <input type="hidden" name="docId" defaultValue={docId} />
            <SubmitButton isSuccess={state?.success} message={state?.message} deletePerm={props.deletePerm} docId={docId} />
        </form>
    )
}