"use client"
import styled from "styled-components";
import { Playfair } from "next/font/google";
import { RiUserFill } from "react-icons/ri";
import { useEffect, useState, useContext } from "react";
import Cookies from 'js-cookie'
import { usePathname } from "next/navigation";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeContext } from "../themeContext";

const playfair = Playfair({ subsets: ["latin"] });

const _Header = styled.header`
    list-style-type: none;
    border-bottom: solid 1px var(--color-border-primary);
    display: flex;
`

const HeaderElement = styled.div`
    padding: 10px 0px;
    width: var(--cont-width);
    margin-left: auto;
    margin-right: auto;
    display: flex;
    align-items: center;
    position: relative;
`

const Logo = styled.div`
    font-family: ${playfair.style.fontFamily};
    font-size: 25px;
    & a {
        text-decoration: none;
        color: var(--color-font-primary);
    }
`
const UserArea = styled.button`
border: none;
background-color: transparent;
margin-left:auto;
margin-right:0px;
font-size: 18px;
display: flex;
align-items: center;
justify-content: center;
cursor: pointer;
padding: 6px;
border-radius: 3px;
color: var(--color-font-primary);
&:hover {
    background-color: var(--color-background-hover);
}
`

const ExpandedUser = styled.ul`
display: none;
position: absolute;
top: 30px;
padding: 10px;
border: solid 1px var(--color-border-primary);
border-radius: 3px;
right: 0;
list-style-type: none;
background-color: var(--color-background);
z-index: 10;
&[aria-expanded="true"] {
    display: flex;
    flex-direction: column;
}
& li {
    margin: 0;
    padding: 0;
    border-radius: 1px;
    user-select: none;
    cursor: pointer;
    font-size: 14px;
    width: 200px;
    white-space: nowrap;
    &:hover {
        background-color: var(--color-background-hover);
    }
    & a {
        margin: 0;
        padding: 0;
        text-decoration: none;
        color: var(--color-font-primary);
        display: flex;
        flex-direction: row;
        padding: 5px 10px;
        line-height: 18px;
    }
    button {
        padding: 0;
        margin: 0;
        border: none;
        background-color: transparent;
        color: var(--color-font-primary);
        display: flex;
        width: 100%;
        flex-direction: row;
        padding: 5px 10px;
        line-height: 18px;
        font-size: 14px;
        cursor: pointer;
        font-family:inherit;
    }
    & p {
        margin: 0;
        padding: 0;
        text-decoration: none;
        color: var(--color-font-primary);
        display: block;
        padding: 5px 10px;
        line-height: 18px;
        text-overflow: ellipsis;
        overflow: hidden;
    }
}
`

export const Header = (props: { userIp?: string, userId?: string, isAdmin?: boolean }) => {
    const [userExpanded, setUserExpanded] = useState(false)
    const router = useRouter()
    const pathname = usePathname()
    const { toggleTheme } = useContext(ThemeContext)

    const listner = (e: Event) => {
        if (!(e.target as HTMLTextAreaElement).matches("[data-header=true], [data-header=true] *")) {
            setUserExpanded(false)
        }
    }
    useEffect(() => {
        addEventListener("click", listner)
        return () => {
            removeEventListener("click", listner)
        }
    }, [])

    return (
        <>
            <_Header>
                <HeaderElement>
                    <Logo>
                        <Link href="/">
                            SCI
                        </Link>
                    </Logo>
                    <UserArea onClick={() => setUserExpanded(!userExpanded)} data-header="true" aria-label="메뉴">
                        <RiUserFill />
                    </UserArea>
                    <ExpandedUser aria-expanded={userExpanded} data-header="true">
                        <li>
                            {props.userIp ?
                                props.userIp && props.userId ?
                                    <p>계정: {props.userId}</p>
                                    : <p>IP: {props.userIp}</p>
                                : <></>
                            }
                        </li>
                        {props.isAdmin ?
                            <li>
                                <Link href={"/admin"}>

                                    관리자 패널
                                </Link>
                            </li>
                            : <></>}
                        <li>
                            <button aria-label="테마 변경" onClick={toggleTheme}>

                                테마 변경
                            </button>
                        </li>
                        <li>
                            <Link href={"/contribution"}>

                                기여 목록
                            </Link>
                        </li>
                        {props.userId ?
                            <li onClick={() => { Cookies.remove("auth"); router.refresh() }} >
                                <p>로그아웃</p>
                            </li>
                            :
                            <li>
                                <Link href={"/login?next=" + pathname}>

                                    로그인
                                </Link>
                            </li>
                        }
                    </ExpandedUser>
                </HeaderElement>
            </_Header>
        </>


    )
}