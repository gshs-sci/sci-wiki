"use client"
import styled from "styled-components";
import { Playfair } from "next/font/google";
import Link from "next/link";
const playfair = Playfair({ subsets: ["latin"] });

const Holder = styled.footer`
    border-top: solid 1px var(--color-border-primary);
    margin-top: 50px;
`
const Elem = styled.div`
    width: var(--cont-width);
    margin-left: auto;
    margin-right: auto;
    padding: 30px 0px;
    & a {
        color: var(--color-font-secondary);
        text-decoration: none;
    }
    & a:hover {
        color: var(--color-link);
    }
`
const Head = styled.ul`
    & a {
        color: var(--color-font-primary);
        text-decoration: underline;
    }
    list-style-type: none;
    padding: 0;
    margin: 0;
    & li {
        font-size: 13px;
        line-height: 20px;
    }
    & li.logo {
        font-family: ${playfair.style.fontFamily};
    }
`
const Tail = styled.ul`
    display: flex;
    list-style-type: none;
    padding: 0;
    margin: 15px 0px;
    font-size: 13px;
    & li {
        margin-right: 10px;
    }
`
export const Footer = () => {
    return (
        <Holder>
            <Elem>
                <Head>
                <li>
                    모든 문서는
                     <Link href="https://creativecommons.org/licenses/by-nc-sa/4.0/">
                         CC BY-NC-SA 4.0 
                    </Link>
                    조건 아래 사용할 수 있습니다.
                </li>
                <li className="logo">
                    Scientia Communio Innovatio(SCI)
                </li>
                </Head>
                <Tail>  
                    <li>
                        <Link href="mailto:gs22048@gs.hs.kr">
                        문의
                        </Link>
                    </li>
            </Tail>
            </Elem>
        </Holder>
    )
}