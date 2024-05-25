"use client"
import styled from "styled-components";
import { Playfair } from "next/font/google";
import { RiUserFill } from "react-icons/ri";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie'

import Link from "next/link";
import { useRouter } from "next/navigation";

const playfair = Playfair({ subsets: ["latin"] });

const _Header = styled.header`
    list-style-type: none;
    border-bottom: solid 1px #cacaca;
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
        color: #000;
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
&:hover {
    background-color: #f0f0f0;
}
`

const ExpandedUser = styled.ul`
display: none;
position: absolute;
top: 30px;
padding: 10px;
border: solid 1px #bfbfbf;
border-radius: 3px;
right: 0;
list-style-type: none;
background-color: #fff;
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
    font-size: 15px;
    width: 130px;
    &:hover {
        background-color: #e9e9e9;
    }
    & a {
        margin: 0;
        padding: 0;
        text-decoration: none;
        color: #000;
        padding: 5px 10px;
        display: block;
    }
    & p {
        margin: 0;
        padding: 0;
        text-decoration: none;
        color: #000;
        padding: 5px 10px;
    }
}
`

export const Header = (props: { userIp?: string, userId?: string }) => {
    const [userExpanded, setUserExpanded] = useState(false)
    const router = useRouter()
    return (
        <>
            <_Header>
                <HeaderElement>
                    <Logo>
                        <Link href="/">
                            SCI
                        </Link>
                    </Logo>
                    <UserArea onClick={() => setUserExpanded(!userExpanded)}>
                        <RiUserFill />
                    </UserArea>
                    <ExpandedUser aria-expanded={userExpanded}>
                        <li>
                        {props.userIp ?
                            props.userIp && props.userId ?
                                <p>계정: {props.userId}</p>
                                : <p>IP: {props.userIp}</p>
                            : <></>
                        }
                        </li>
                        <li>
                            <p>
                            기여 목록
                            </p>
                        </li>
                        {props.userId ?
                            <li onClick={() => { Cookies.remove("auth");router.refresh() }}>
                                <p>로그아웃</p>
                            </li>
                            :
                            <li>
                                <Link href="/login">
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