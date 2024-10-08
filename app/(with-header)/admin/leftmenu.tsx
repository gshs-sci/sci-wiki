"use client"
import Link from "next/link"
import { useState } from "react"
import { MdMenu } from "react-icons/md"
import styled from "styled-components"

const MenuHolder = styled.ul`
    list-style-type: none;
    padding: 0;
    margin: 0;
    padding: 10px;
    border-right: solid 1px var(--color-border-third);
    margin-right: 30px;
    width: 200px;
    flex-shrink: 0;
    @media(max-width: 800px) {
        display: none;
        position: fixed;
        background-color: var(--color-background);
        height: 100%;
        z-index: 1;
        top:0;
        padding-top: 50px;
        left: 0;
        &[aria-expanded="true"] {
            display: block;
        }
    }
`
const MenuElem = styled.li<{ $active: boolean }>`
    font-size: 15px;
    color: var(--color-font-primary);
    & a {
        display: block;
        padding: 5px 10px;
        color: ${props => props.$active ? "var(--color-font-primary)" : "var(--color-link)"};
        text-decoration: none;
    }
    user-select: none;
    cursor: pointer;
    &:hover {
        background-color: var(--color-background-hover);
        text-decoration: underline;
    }
`
const ToggleBtn = styled.span`
    cursor: pointer;
    font-size: 28px;
    position: fixed;
    bottom:10px;
    left: 10px;
    background-color: var(--color-background);
    width: 40px;
    height: 40px;
    justify-content: center;
    align-items: center;
    border: solid 1px var(--color-border-primary);
    display: none;
    z-index: 2;
    @media(max-width: 800px) {
        display: flex;
        border-radius: 10px;
    }
`

export const Menu = (props: { activeKey: string }) => {
    const [menuShown,setMenuShown] = useState(false)
    return (
        <>
            <MenuHolder aria-expanded={menuShown}>
            <MenuElem $active={props.activeKey == "admin"}>
                <Link href="/admin">
                    콘솔 홈
                </Link>
            </MenuElem>
            <MenuElem $active={props.activeKey == "user"}>
                <Link href="/admin/user">
                    사용자 관리
                </Link>
            </MenuElem>
        </MenuHolder>
        <ToggleBtn onClick={()=>setMenuShown(!menuShown)}><MdMenu /></ToggleBtn>
        </>
    )
}