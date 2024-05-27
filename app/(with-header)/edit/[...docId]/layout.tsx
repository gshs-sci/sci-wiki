"use client"
import styled from "styled-components";
import { Noto_Sans_KR } from "next/font/google";

const sansNormal = Noto_Sans_KR({ subsets: ["latin"] })

const Holder = styled.div`
    margin-left: auto;
    margin-right: auto;
    width: var(--cont-width);
    display: flex;
    flex-direction: column;
    font-family: ${sansNormal.style.fontFamily};
    min-height: calc(100vh - 51px);
`

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Holder>
                {children}
        </Holder>
    )
}