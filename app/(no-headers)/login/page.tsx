"use client"
import styled from "styled-components"
import { Noto_Sans_KR } from "next/font/google";

const sansNormal = Noto_Sans_KR({ subsets: ["latin"] })

const Holder = styled.div`
    margin-left: auto;
    margin-right: auto;
    width: var(--cont-width);
    display: flex;
    font-family: ${sansNormal.style.fontFamily};
`

export default function loginPage() {
    return (
        <Holder>
            
        </Holder>
    )
}