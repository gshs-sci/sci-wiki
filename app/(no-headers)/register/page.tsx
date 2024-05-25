"use client"
import styled from "styled-components"
import { Noto_Sans_KR, Noto_Serif_KR, Playfair } from "next/font/google";
import { useFormStatus, useFormState } from 'react-dom'
import { Register } from "./action";
import { useRef, useState, useEffect } from "react";
import Turnstile, { useTurnstile } from "react-turnstile";

const sansNormal = Noto_Sans_KR({ subsets: ["latin"] })

const playfair = Playfair({ subsets: ["latin"] });

const Logo = styled.div`
    font-family: ${playfair.style.fontFamily};
    font-size: 35px;
    & a {
        text-decoration: none;
        color: #000;
    }
`

const Holder = styled.div`
    margin-left: auto;
    margin-right: auto;
    width: var(--cont-width);
    display: flex;
    font-family: ${sansNormal.style.fontFamily};
    height: 100vh;
    align-items: center;
    justify-content: center;
    width: 350px;
    flex-direction: column;
    @media(max-width: 420px) {
        width: var(--cont-width);
    }
`
const InputElem = styled.input<{ $isError?: boolean }>`
    padding: 10px 10px;
    border: none;
    border: solid 1px ${props => props.$isError ? "#eb4034" : "#000"};
    border-radius: 4px;
    font-size: 15px;
    margin-top: 12px;
`
const InputLabel = styled.b`
    margin: 0;
    padding: 0;
    font-size: 14px;
    &::after {
        content: "*";
        color: #eb4034;
    }
    margin-top: 20px;
`

const InputExp = styled.p`
    margin: 0;
    padding: 0;
    font-size: 12px;
    margin-top: 10px;
`
const InputErr = styled.p`
    margin: 0;
    padding: 0;
    font-size: 12px;
    margin-top: 5px;
    color: #eb4034;
`
const NextBtn = styled.button`
    background-color: #000;
    color: #fff;
    padding: 10px 0px;
    border: none;
    border-radius: 4px;
    margin-top: 20px;
    cursor: pointer;
    font-size: 13px;
`

const serifNormal = Noto_Serif_KR({ weight: "400", subsets: ["latin"] })
const serifBold = Noto_Serif_KR({ weight: "600", subsets: ["latin"] })

const ContinueBtn = () => {
    const { pending } = useFormStatus()
    const [isVerified, setVerified] = useState(false)
    const turnstile = useTurnstile()

    useEffect(() => {
        if(!turnstile) return
        if (!pending) {
            setVerified(false)
            turnstile.reset();
        }
    }, [pending,turnstile])

    return (
        <>
            <Turnstile
                sitekey="0x4AAAAAAAax0WPa0nug6v7L"
                onVerify={() => setVerified(true)}
                refreshExpired="auto"
            />
            <NextBtn type="submit" disabled={!isVerified || pending}>{pending ? "처리중.." :"계속하기"}</NextBtn>
        </>

    )
}

export default function registerPage() {
    const [state, formAction] = useFormState(Register, null)
    return (
        <Holder>
            <form action={formAction}>
                <Logo>SCI</Logo>
                <InputLabel>이메일 주소</InputLabel>
                <InputExp>아래 주소로 인증 메일을 전송합니다.</InputExp>
                <InputElem required type="email" name="email" placeholder="이메일 주소" autoComplete="email" $isError={!!state?.errors?.email}></InputElem>
                {state?.errors?.email ? <InputErr>{state?.errors?.email}</InputErr> : <></>}
                <InputLabel>아이디</InputLabel>
                <InputExp>아이디는 대소문자를 구별하지 않습니다. 알파벳, 숫자 및 -,_만 사용하실 수 있습니다.</InputExp>
                <InputElem required name="id" placeholder="아이디" autoComplete="username" $isError={!!state?.errors?.id}></InputElem>
                {state?.errors?.id ? <InputErr>{state?.errors?.id}</InputErr> : <></>}
                <InputLabel>비밀번호</InputLabel>
                <InputExp>8글자 이상이어야 합니다.</InputExp>
                <InputElem required name="pw" placeholder="비밀번호" autoComplete="new-password" $isError={!!state?.errors?.pw} type="password" minLength={8}></InputElem>
                {state?.errors?.pw ? <InputErr>{state?.errors?.pw}</InputErr> : <></>}
                <InputLabel>비밀번호 재입력</InputLabel>
                <InputElem $isError={!!state?.errors?.pwre} required autoComplete="new-password" placeholder="비밀번호 재입력" name="pwre" type="password"></InputElem>
                {state?.errors?.pwre ? <InputErr>{state?.errors?.pwre}</InputErr> : <></>}
                <ContinueBtn />
            </form>
        </Holder>
    )
}