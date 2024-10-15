"use client"

import styled from "styled-components";
import { Noto_Sans_KR } from "next/font/google";
import { useFormStatus, useFormState } from "react-dom";
import { useEffect, useState, useTransition } from "react";
import Turnstile, { useTurnstile } from "react-turnstile";
import { Edit, Delete } from "./action";
import { Textarea } from "@/app/components/edit/editor";
import Link from "next/link";
import { Category } from "@/app/components/edit/category/category";
import { Tags } from "@/app/components/edit/tags/tags";
import { RiArrowDownSLine } from "react-icons/ri";

const BottomBtns = styled.div`
    display: flex;   
    margin-top: 20px;
    justify-content: space-between;
    position: relative;
`
const LBtn = styled.div`
    display: flex;
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

const DelBtn = styled.button`
    background-color: transparent;
    color: #c90000;
    border: none;
    cursor: pointer;
    font-size: 13px;
`
const DelPrompt = styled.div`
    width: 250px;
    position: absolute;
    right: 0;
    background-color: var(--color-background);
    border: solid 1px var(--color-border-primary);
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
        color: var(--color-font-secondary);
        margin-top: 10px;
    }
    & button {
        margin-top: 10px;
        border: none;
        border-radius: 3px;
        background-color: var(--color-background-hover);
        border: solid 1px var(--color-border-secondary);
        color: #c90000;
        padding: 7px 10px;
        font-size: 12px;
        cursor: pointer;
    }
    & button:disabled {
        cursor: not-allowed;
    }
    & button:hover {
        background-color: #c90000;
        border-color: #c90000;
        color: #fff;
    }
`

const SubBtns = styled.div`
    display: flex;
    justify-content: flex-start;
    margin-top: 20px;

    & button {
        border: none;
        border-radius: 3px;
        padding: 7px 10px;
        font-size: 12px;
        cursor: pointer;
        margin-right: 10px;
    }
    & button.cancel {
        background-color: var(--color-border-third);
        border: solid 1px var(--color-border-secondary);
        color: var(--color-font-primary);
    }
    & button.submit {
        border: solid 1px var(--color-border-secondary);
        background-color: #18891b;
        color:#fff;

    }
    & button.submit:hover {
        background-color: #1cb921;
        color: #fff;
    }
    
`
const Sub_bg = styled.div`
    z-index: 11;
    width: 100vw;
    height: 100vh;
    background-color: transparent;
    backdrop-filter: brightness(0.5);
    position: fixed;
    top:0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
`
const Sub_Banner = styled.div<{ $isAlert?: boolean }>`
    background-color: ${props => props.$isAlert ? "var(--color-banner-alert)" : "var(--color-banner-normal)"};
    border: solid 1px var(--color-border-secondary);
    border-radius: 5px;
    margin-top: 10px;
    padding: 7px;
    font-size: 12px;
    line-height: 18px;
    a {
        color: #2776af;
    }
`

const SubPrompt = styled.div`
    width: 400px;
    left: 0;
    background-color: var(--color-background);
    border: solid 1px var(--color-border-secondary);
    padding: 20px;
    z-index: 12;
    display: flex;
    flex-direction: column;
    border-radius: 3px;
    & b {
        font-size: 15px;
        margin-bottom: 20px;
    }
    & p {
        font-size: 13px;
        margin: 0;
        margin-bottom: 10px;
        padding: 0;
        line-height: 17px;
    }
    & p.delres {
        margin: 0;
        color: #a8a8a8;
        margin-top: 10px;
    }
    @media(max-width: 450px) {
        width: 70vw;
    }
`
const CommitMsg = styled.textarea`
    resize: vertical;
    padding: 10px;
    border-radius: 5px;
    border: solid 1px var(--color-border-secondary);
    background-color: transparent;
    min-height: 100px;
    max-height: calc(100vh - 300px);
    font-size: 13px;
`

const SubmitButton = (props: { isSuccess?: boolean, message?: string, deletePerm: boolean, docId: string, user: string | null, ip?: string }) => {
    const { user, ip } = props
    const { pending } = useFormStatus()
    const [token, setToken] = useState("")
    const turnstile = useTurnstile()
    const [deletePrompt, setDeletePrompt] = useState(false)
    const [submitPrompt, setSubmitPrompt] = useState(false)

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
                    {submitPrompt ?
                        <Sub_bg>
                            <SubPrompt>
                                <b>문서 수정하기</b>
                                <p>설명 추가</p>
                                <CommitMsg placeholder="무엇을 변경하셨나요?" name="commitmsg" />
                                {user == null || user == "" ?
                                    <Sub_Banner $isAlert={true}>로그인되지 않았습니다. 아이피 ({ip})가 문서의 기여 목록에 저장됩니다.
                                        <Link href="/login">로그인하기</Link>
                                    </Sub_Banner> :
                                    <Sub_Banner $isAlert={false}>아이디 ({user})가 문서의 기여 목록에 저장됩니다.
                                    </Sub_Banner>
                                }
                                {props.message ? <Sub_Banner $isAlert={!props.isSuccess}>{props.message}
                                </Sub_Banner> : <></>}
                                <SubBtns>
                                    <button className="submit" type="submit" disabled={pending || !token}>{pending ? "저장중.." : token ? "변경사항 적용하기" : "잠시만 기다려 주세요.."}</button>
                                    <button className="cancel" type="button" onClick={() => setSubmitPrompt(false)}>취소</button>
                                </SubBtns>
                            </SubPrompt>
                        </ Sub_bg>
                        : <></>}
                    <SubmitBtn type="button" onClick={() => setSubmitPrompt(true)} disabled={submitPrompt}>
                        변경사항 적용하기
                    </SubmitBtn>
                </LBtn>
                {props.deletePerm ? <>
                    {deletePrompt ? <DelPrompt>
                        <b>정말 삭제하시겠습니까?</b>
                        <p>삭제된 문서는 복구할 수 없습니다. 또한 문서의 수정 기록도 함께 삭제됩니다. </p>
                        <button type="button" onClick={deleteDoc}>예, 문서를 삭제하겠습니다</button>
                        {deleteResult ? <p className="delres">{deleteResult.message}
                            {deleteResult.success ? <Link href="/">홈으로 돌아가기</Link> : <></>}
                        </p> : <></>}
                    </DelPrompt> : <></>}
                    <DelBtn type="button" onClick={() => setDeletePrompt(!deletePrompt)}>{deletePrompt ? "삭제 취소" : "문서 삭제"}</DelBtn>
                </> : <></>}
            </BottomBtns>

        </>
    )
}

const PermissionHolder = styled.div`
    width: 100%;
    display: flex;
    color: var(--color-font-secondary);
    margin-top: 20px;
    flex-direction: column;
    user-select: none;
`
const PermissionHeader = styled.div<{ $rotate?: boolean }>`
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    cursor: pointer;
    border: solid 1px var(--color-border-primary);
    border-radius: 2px;
    padding: 5px 7px;
    color:${props => props.$rotate ? "var(--color-font-primary)" : "var(--color-font-secondary)"};

    &:hover {
        color: var(--color-font-primary);
    }
    & span {
        rotate:${props => props.$rotate ? "180deg" : "0deg"};
        font-size: 16px;
        margin-left: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

`
const PermissionBody = styled.div<{ $show: boolean }>`
    display: ${props => props.$show ? "flex" : "none"};
    flex-direction: column;
    & ul {
        margin: 0;
        list-style-type: none;
        font-size: 13px;
        display: flex;
        flex-direction: column;
        border-bottom: solid 1px var(--color-border-primary);
        padding: 10px;
    }
    & li {
        margin: 3px 0px;
        display: flex;
        justify-content: space-between;
        max-width: 200px;
    }

    & ul:nth-last-child(1) {
        border-bottom: none;
    }
`

const Permission = (props: { isShown: boolean, toggleFn: any, isAdmin: boolean,pinned:boolean, adminEditable:boolean }) => {
    const { isShown, toggleFn,pinned,adminEditable } = props
    return (
        <PermissionHolder>
            <PermissionHeader onClick={() => toggleFn()} $rotate={isShown}>
                권한 설정 {isShown ? "접기" : "펼치기"}
                <span>
                    <RiArrowDownSLine />
                </span>
            </PermissionHeader>
            <PermissionBody $show={isShown}>
                {props.isAdmin ? <ul>
                    <li>
                        <label htmlFor="pin">메인에 고정하기</label>
                        <input type="checkbox" name="pin" id="pin" defaultChecked={pinned}/>
                    </li>
                    <li>
                        <label htmlFor="editPermAdmin">관리자만 편집 가능</label>
                        <input type="checkbox" name="editPermAdmin" id="editPermAdmin" defaultChecked={adminEditable}/>
                    </li>

                </ul> : <ul>사용 가능한 권한 설정이 없습니다</ul>}

            </PermissionBody>
        </PermissionHolder>)
}

export const EditArea = (props: {
    title: string,
    category: string,
    tags: Array<string>,
    content: string,
    docId: string,
    deletePerm: boolean,
    user: string | null,
    ip?: string,
    preCompile?: JSX.Element,
    isAdmin: boolean,

    pinned:boolean,
    adminEditable:boolean
}) => {
    const { title, content, docId, user, ip, isAdmin,adminEditable,pinned } = props
    const [state, formAction] = useFormState(Edit, null)
    const [isPermissionOpen, setPermissionOpen] = useState(false)
    return (
        <form action={formAction}>
            <h1>{title}</h1>
            <Category default={props.category} isRequired={true} name="cat" />
            <Tags name="tags" default={props.tags} />
            <Textarea defaultValue={content}></Textarea>
            <input type="hidden" name="docId" defaultValue={docId} />
            <Permission 
            isShown={isPermissionOpen} 
            toggleFn={() => setPermissionOpen(!isPermissionOpen)} 
            isAdmin={isAdmin}
            adminEditable={adminEditable}
            pinned={pinned}
            />
            <SubmitButton isSuccess={state?.success} message={state?.message} deletePerm={props.deletePerm} docId={docId} user={user} ip={ip} />
        </form>
    )
}