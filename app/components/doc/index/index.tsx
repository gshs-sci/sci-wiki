"use client"

import Link from "next/link"
import { useState, useContext } from "react"
import { MdKeyboardArrowDown } from "react-icons/md";
import styled from "styled-components";
import { CurrentActive } from "../provider";
import { MdMenu } from "react-icons/md";

interface Title {
    level: number
    text: string
    id: string
    children: Array<Title>
}

const IndexParent = styled.div`
    position: sticky;
    list-style-type: none;
    margin: 0;
    padding: 0;
    flex-shrink: 0;
    top:0;
    left: 0;
    align-self: flex-start;
    padding-right: 20px;
    padding-top: 20px;
    padding-left: 20px;
    display: flex;
    width: 200px;
    z-index: 1;
    flex-direction: column;
    & a {
        text-decoration: none;
        color: inherit;
        line-height: 30px;
    }
    & a:hover {
        text-decoration: underline;
    }
    @media(max-width: 800px) {
        display: none;
        position: fixed;
        background-color: #fff;
        height: 100%;
        border-right: solid 1px #cacaca;
        &[aria-expanded="true"]{
            display: flex;
        }
    }
`
const IndexHeader = styled.p`
    border-bottom: solid 1px #f0f0f0;
    padding: 0;
    margin: 0;
    padding: 5px 0px;
    margin: 5px 0px;
`
const Ul = styled.ul`
    margin:0;
    padding: 0;
    list-style-type: none;
    padding-left: 20px;
    border-left: solid 1px #dadada;
    display: block;
    &[aria-expanded="false"] {
        display: none;
    }
`
const Li = styled.li<{ $isActive: boolean }>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    color:${props => props.$isActive ? "#000" : "#4287f5"};
    font-weight: ${props => props.$isActive ? "bold" : "normal"};
    font-size: 15px;
`
const LiLabel = styled.div`
    display: flex;
    align-items: center;
`
const RotateArrow = styled.div<{ $rotated: boolean }>`
display: flex;
align-items: center;
justify-content: center;
rotate:${props => props.$rotated ? "180deg" : "0deg"};
margin-left: 10px;
cursor: pointer;
`
const MasterUl = styled(Ul)`
    border: none;
    margin: 0;
    padding: 0;
`

const ToggleBtn = styled.span`
    cursor: pointer;
    font-size: 28px;
    position: fixed;
    bottom:10px;
    left: 10px;
    background-color: #fff;
    width: 40px;
    height: 40px;
    justify-content: center;
    align-items: center;
    border: solid 1px #cacaca;
    display: none;
    z-index: 2;
    @media(max-width: 800px) {
        display: flex;
        border-radius: 10px;
    }
`

const Licomponent = (props: { isActive: boolean, elem: any }) => {
    const [isDropped, setIsDropped] = useState(false)
    return (
        <Li $isActive={props.isActive}>
            <LiLabel>
                <Link href={"#" + props.elem.id}>{props.elem.text}</Link>
                <RotateArrow $rotated={isDropped} onClick={() => setIsDropped(!isDropped)} >
                    <MdKeyboardArrowDown />
                </RotateArrow>
            </LiLabel>

            <Ul aria-expanded={isDropped}>
                <RecursiveIndex titles={props.elem.children} />
            </Ul>
        </Li>
    )
}


const RecursiveIndex = (props: { titles: Array<Title> }) => {
    const active = useContext(CurrentActive);
    return (
        <>
            {props.titles.map((elem) => {
                if (elem.children.length == 0) {
                    return (
                        <Li $isActive={active == elem.id} key={elem.id}>
                            <LiLabel>
                                <Link href={"#" + elem.id}>{elem.text}</Link>
                            </LiLabel>
                        </Li>
                    )
                } else {
                    return (
                        <Licomponent isActive={active == elem.id} elem={elem} key={elem.id}/>
                    )
                }
            })}
        </>
    )
}

export const Index = (props: { titles: Array<Title> }) => {
    const [isMenuShown, setMenuShown] = useState(false)
    return (
        <>
            <IndexParent aria-expanded={isMenuShown}>
                <IndexHeader>목차</IndexHeader>
                <MasterUl>
                    <RecursiveIndex titles={props.titles} />
                </MasterUl>
            </IndexParent>
            <ToggleBtn onClick={() => setMenuShown(!isMenuShown)}><MdMenu /></ToggleBtn>
        </>
    )
}