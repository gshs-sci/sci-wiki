"use client"
import styled from "styled-components"
import { Playfair } from "next/font/google";
import Link from "next/link";
import Turnstile, { useTurnstile } from "react-turnstile";
import { useEffect, useState } from "react";
import { useFormStatus, useFormState } from "react-dom";
import { RequestPwReset } from "./action";


const playfair = Playfair({ subsets: ["latin"] });

const Logo = styled.div`
    font-family: ${playfair.style.fontFamily};
    font-size: 35px;
    & a {
        text-decoration: none;
        color: var(--color-font-primary);
    }
`

const Holder = styled.div`
    margin-left: auto;
    margin-right: auto;
    width: var(--cont-width);
    display: flex;
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
    border: solid 1px ${props => props.$isError ? "#eb4034" : "var(--color-border-primary)"};
    border-radius: 4px;
    font-size: 15px;
    margin-top: 12px;
    background-color: transparent;
    color: var(--color-font-primary);
`
const InputLabel = styled.b`
    margin: 0;
    padding: 0;
    font-size: 14px;
    color: var(--color-font-primary);
    &::after {
        content: "*";
        color: #eb4034;
    }
    margin-top: 20px;
`

const InputErr = styled.p`
    margin: 0;
    padding: 0;
    font-size: 12px;
    margin-top: 5px;
    color: #eb4034;
`
const NextBtn = styled.button`
    background-color: var(--color-button-background);
    color: var(--color-button-text);
    padding: 10px 0px;
    border: none;
    border-radius: 4px;
    margin-top: 20px;
    cursor: pointer;
    font-size: 13px;
`
const InputExp = styled.p`
    margin: 0;
    padding: 0;
    font-size: 12px;
    margin-top: 10px;
    color: var(--color-font-primary);
    & a {
        color: var(--color-link);
    }
`
const Btn = () => {
    const { pending } = useFormStatus()
    const [isVerified, setVerified] = useState(false)
    const turnstile =useTurnstile()

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
            <NextBtn type="submit" disabled={!isVerified || pending}>{pending ? "처리중.." : isVerified?"비밀번호 초기화":"잠시만 기다려 주세요.."}</NextBtn>
        </>

    )
}

export default function LoginPage() {
    const [state, formAction] = useFormState(RequestPwReset,null)
    return (
        <Holder>
            <form action={formAction}>
                <Logo>
                    <Link href="/">
                        SCI
                    </Link>
                </Logo>
                <InputLabel>이메일</InputLabel>
                <InputElem required type="email" name="email" placeholder="가입 시 사용한 이메일 주소" autoComplete="email" $isError={!!state && !state.success}></InputElem>
                {state && state?.message?state?.success ?  <InputExp>{state.message}</InputExp>:<InputErr>{state.message}</InputErr>:<></>}
                <InputExp>올바른 이메일 주소를 입력하세요. 가입 시 사용한 이메일 주소로 비밀번호 초기화 링크를 전송합니다.</InputExp>
                <Btn />
            </form>
        </Holder>
    )
}