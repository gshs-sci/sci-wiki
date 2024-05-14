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

export const Header = () => {
    const [userExpanded, setUserExpanded] = useState(false)
    return (<_Header>
        <HeaderElement>
                <Logo>
                <Link href="/">
                    SCI
                    </Link>
                </Logo>
            
            <UserArea>
                <RiUserFill />
            </UserArea>
        </HeaderElement>
    </_Header>)
}