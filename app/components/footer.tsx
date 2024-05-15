"use client"
import styled from "styled-components";
import { Playfair } from "next/font/google";
const playfair = Playfair({ subsets: ["latin"] });

const Holder = styled.footer`
    border-top: solid 1px #cacaca;
    width: 100vw;
    margin-top: 50px;
`
const Elem = styled.div`
    width: var(--cont-width);
    margin-left: auto;
    margin-right: auto;
    padding: 20px 0px;
    font-family: ${playfair.style.fontFamily};
`
export const Footer = () => {
    return (
        <Holder>
            <Elem>
                &copy; Scientia Communio Innovatio(SCI)
            </Elem>
        </Holder>
    )
}