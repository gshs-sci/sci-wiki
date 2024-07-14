"use client"
import styled from "styled-components"
import { Playfair } from "next/font/google";
import Link from "next/link";
import Turnstile, { useTurnstile } from "react-turnstile";
import { useEffect, useState, useRef, useTransition } from "react";
import { ResetPW } from "./action";
import { useRouter } from "next/navigation";


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
const Btn = (props:{pending:boolean}) => {
    const [isVerified, setVerified] = useState(false)
    const turnstile = useTurnstile()

    const {pending} = props
    useEffect(() => {
        if (!turnstile) return
        if (!pending) {
            setVerified(false)
            turnstile.reset();
        }
    }, [pending, turnstile])

    return (
        <>
            <Turnstile
                sitekey="0x4AAAAAAAax0WPa0nug6v7L"
                onVerify={() => setVerified(true)}
                refreshExpired="auto"
            />
            <NextBtn type="submit" disabled={!isVerified || pending}>{pending ? "처리중.." : isVerified ? "비밀번호 재설정" : "잠시만 기다려 주세요.."}</NextBtn>
        </>

    )
}

export default function LoginPage({ params }: { params: { resetcode: string } }) {
    const [submitState, setSubmitState] = useState<any>()
    const formRef = useRef<HTMLFormElement>(null)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
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
                result = await ResetPW("", form)
            }
            setSubmitState(result)
        })
    }

    useEffect(()=>{
        if(submitState && submitState["success"]) {
            router.replace("/login")
        }
    },[submitState])

    return (
        <Holder>
            <form action={SubmitForm} ref={formRef}>
                <Logo>
                    <Link href="/">
                        SCI
                    </Link>
                </Logo>
                <InputLabel>새로운 비밀번호</InputLabel>
                <InputElem $isError={!!submitState?.errors?.pw} required type="password" name="pw" placeholder="사용할 비밀번호" autoComplete="pw" minLength={8}></InputElem>
                {submitState?.errors?.pw ? <InputErr>{submitState?.errors?.pw}</InputErr> : <></>}
                <InputLabel>비밀번호 재입력</InputLabel>
                <InputElem $isError={!!submitState?.errors?.pwre} required type="password" name="pwre" placeholder="비밀번호 재입력" autoComplete="pw" ></InputElem>
                <input type="hidden" value={params.resetcode} name="code"/>
                {submitState?.errors?.pwre ? <InputErr>{submitState?.errors?.pwre}</InputErr> : <></>}
                <InputExp>재설정할 비밀번호는 8글자 이상이어야 합니다. 다른 곳에서 사용하지 않는 비밀번호를 사용하세요</InputExp>
                <Btn pending={isPending} />
            </form>
        </Holder>
    )
}