"use client"

import type { Metadata } from "next";

import styled from "styled-components";

const Holder = styled.div`
    margin-left: auto;
    margin-right: auto;
    width: var(--cont-width);
    display: flex;
    flex-direction: column;
    overflow: scroll;
`
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Holder>
        {children}
    </Holder>
  );
}
