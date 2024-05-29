"use client"
import styled from "styled-components";


const Holder = styled.div`
    margin-left: auto;
    margin-right: auto;
    width: var(--cont-width);
    display: flex;
    flex-direction: column;
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