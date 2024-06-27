"use client"
import styled from "styled-components"
import { Playfair } from "next/font/google";
import { Register } from "./action";
import { useRef, useState, useEffect, useTransition } from "react";
import Turnstile, { useTurnstile } from "react-turnstile";
import Link from "next/link";

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

export default function RegisterPage() {
    const formRef = useRef<HTMLFormElement>(null)
    const [isPending, startTransition] = useTransition()
    const [submitState, setSubmitState] = useState<any>()

    const [isVerified, setVerified] = useState(false)
    const turnstile = useTurnstile()

    useEffect(() => {
        if (!turnstile) return
        if (!isPending) {
            setVerified(false)
            turnstile.reset();
        }
    }, [isPending, turnstile])

    const SubmitForm = async () => {
        const form = new FormData(formRef.current ?? undefined)
        let result;
        startTransition(async () => {
            if (!(form.get("pw") == form.get("pwre"))) {
                result = {
                    success: false,
                    errors: {
                        pwre: "비밀번호가 일치하지 않습니다"
                    }
                }
            } else {
                form.delete("pwre")
                result = await Register("", form)
            }
            setSubmitState(result)
        })
    }
    return (
        <Holder>
            <form ref={formRef} action={SubmitForm}>
                <Logo>
                    <Link href="/">
                        SCI
                    </Link>
                </Logo>
                <InputLabel>이메일 주소</InputLabel>
                <InputExp>아래 주소로 인증 메일을 전송합니다.</InputExp>
                <InputElem required type="email" name="email" placeholder="이메일 주소" autoComplete="email" $isError={!!submitState?.errors?.email}></InputElem>
                {submitState?.errors?.email ? <InputErr>{submitState?.errors?.email}</InputErr> : <></>}
                <InputLabel>아이디</InputLabel>
                <InputExp>아이디는 대소문자를 구별하지 않습니다. 알파벳, 숫자 및 -,_만 사용하실 수 있습니다.</InputExp>
                <InputElem required name="id" placeholder="아이디" autoComplete="username" $isError={!!submitState?.errors?.id}></InputElem>
                {submitState?.errors?.id ? <InputErr>{submitState?.errors?.id}</InputErr> : <></>}
                <InputLabel>비밀번호</InputLabel>
                <InputExp>8글자 이상이어야 합니다.</InputExp>
                <InputElem required name="pw" placeholder="비밀번호" autoComplete="new-password" $isError={!!submitState?.errors?.pw} type="password" minLength={8}></InputElem>
                {submitState?.errors?.pw ? <InputErr>{submitState?.errors?.pw}</InputErr> : <></>}
                <InputLabel>비밀번호 재입력</InputLabel>
                <InputElem $isError={!!submitState?.errors?.pwre} required autoComplete="new-password" placeholder="비밀번호 재입력" name="pwre" type="password"></InputElem>
                {submitState?.errors?.pwre ? <InputErr>{submitState?.errors?.pwre}</InputErr> : <></>}
                <Turnstile
                    sitekey="0x4AAAAAAAax0WPa0nug6v7L"
                    onVerify={() => setVerified(true)}
                    refreshExpired="auto"
                />
                <NextBtn type="submit" disabled={!isVerified || isPending}>{isPending ? "처리중.." : isVerified?"계속하기":"잠시만 기다려 주세요.."}</NextBtn>
            </form>
        </Holder>
    )
}