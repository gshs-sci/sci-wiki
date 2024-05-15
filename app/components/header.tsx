"use client"
import styled from "styled-components";
import { Playfair } from "next/font/google";
import { RiUserFill } from "react-icons/ri";
import { useState } from "react";
import Link from "next/link";

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
    padding: 5px 10px;
    border-radius: 1px;
    user-select: none;
    cursor: pointer;
    font-size: 15px;
    min-width: 80px;
    &:hover {
        background-color: #e9e9e9;
    }
}
`

export const Header = (props: { userIp?: string, userId?: string }) => {
    const [userExpanded, setUserExpanded] = useState(false)
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
                        {props.userIp ?
                            <li>{props.userIp}</li> :
                            props.userIp && props.userId ?
                                <li>{props.userId}</li>
                                : <></>
                        }
                        <li>기여 목록</li>
                        {props.userId ? <></> : <li>로그인</li>}
                    </ExpandedUser>
                </HeaderElement>
            </_Header>
        </>


    )
}