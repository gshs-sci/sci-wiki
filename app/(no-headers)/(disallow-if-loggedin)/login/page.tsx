"use client"
import styled from "styled-components"
import { Playfair } from "next/font/google";
import Link from "next/link";
import Turnstile, { useTurnstile } from "react-turnstile";
import { useEffect, useState } from "react";
import { useFormStatus, useFormState } from "react-dom";
import { Login } from "./action";
import { useRouter,useSearchParams } from "next/navigation";

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
const InputExp = styled.p`
    margin: 0;
    padding: 0;
    font-size: 12px;
    margin-top: 10px;
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
            <NextBtn type="submit" disabled={!isVerified || pending}>{pending ? "처리중.." : isVerified?"로그인":"잠시만 기다려 주세요.."}</NextBtn>
        </>

    )
}

export default function LoginPage() {
    const [state, formAction] = useFormState(Login, null)
    const router = useRouter()
    const searchParams =useSearchParams()
    useEffect(()=>{
        if(state?.success) {
            let sp = searchParams.get("next")
            if(sp==null){
                router.replace("/")
            }else {
                router.replace(sp)
            }
        }
    },[state?.success])
    return (
        <Holder>
            <form action={formAction}>
                <Logo>
                    <Link href="/">
                        SCI
                    </Link>
                </Logo>
                <InputLabel>아이디</InputLabel>
                <InputElem required type="id" name="id" placeholder="이메일 주소 또는 아이디" autoComplete="id" $isError={!!state?.errors?.id}></InputElem>
                {state?.errors?.id && state?.errors?.id!=" " ? <InputErr>{state?.errors?.id}</InputErr> : <></>}
                <InputLabel>비밀번호</InputLabel>
                <InputElem required type="password" name="pw" placeholder="비밀번호" autoComplete="password" $isError={!!state?.errors?.pw}></InputElem>
                {state?.errors?.pw ? <InputErr>{state?.errors?.pw}</InputErr> : <></>}
                <InputExp>계정이 없다면 <Link href={"/register"}>여기</Link>에서 만들 수 있습니다. 계정이 있으면 아이피 노출 없이 문서를 수정할 수 있습니다.</InputExp>
                <Btn />
            </form>
        </Holder>
    )
}