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
import { RiArrowDownSLine } from "react-icons/ri";

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

const Permission = (props: { isShown: boolean, toggleFn: any, isAdmin: boolean }) => {
    const { isShown, toggleFn } = props
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
                        <input type="checkbox" name="pin" id="pin"/>
                    </li>
                    <li>
                        <label htmlFor="editPermAdmin">관리자만 편집 가능</label>
                        <input type="checkbox" name="editPermAdmin" id="editPermAdmin"/>
                    </li>

                </ul> : <ul>사용 가능한 권한 설정이 없습니다</ul>}

            </PermissionBody>
        </PermissionHolder>)
}

export function Document(props:{isAdmin: boolean}) {
    const {isAdmin} = props
    const params = useSearchParams()
    const title:any=typeof params.get("where") == "string"?params.get("where"):""
    const [state, formAction] = useFormState(Create, null)
    const [isPermissionOpen, setPermissionOpen] = useState(false)
    return (
        <Holder>
            <form action={formAction}>
                <TitleInput placeholder="제목을 입력하세요" spellCheck={false} name="title" required defaultValue={title}/>
                <Category isRequired={true} name="cat"/>
                <Tags name="tags"/>
                <Textarea defaultValue="" />
                <Permission 
                isShown={isPermissionOpen} 
                toggleFn={() => setPermissionOpen(!isPermissionOpen)} 
                isAdmin={isAdmin}
                />
                <BottomBtns>
                    <SubmitButton isSuccess={state?.success} message={state?.message} />
                </BottomBtns>
            </form>
        </Holder>
    )
}