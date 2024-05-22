"use client"
import styled from "styled-components";
import { Noto_Sans_KR,Playfair } from "next/font/google";
import { RefObject, useEffect, useRef } from "react";
import { Validate } from "./action";
import { useFormState } from "react-dom";

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
    flex-direction: column;
    width: 350px;
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
export default function validatePage({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const [state, formAction] = useFormState(Validate, null)
    return (
        <Holder>
            <form action={formAction}>
            <Logo>SCI</Logo>
            <InputLabel>인증번호</InputLabel>
                <InputExp>{children}으로 인증 코드를 전송했습니다. 메일이 오지 않았다면, 스팸함을 확인해주세요</InputExp>
                <InputElem name="code" required placeholder="인증번호(5자리)" $isError={!!state?.errors?.code}></InputElem>
                {state?.errors?.code ? <InputErr>{state?.errors?.code}</InputErr> : <></>}
                <NextBtn>인증하기</NextBtn>
            </form>
        </Holder>
    )
}