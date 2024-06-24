"use client"
import { Change } from "diff"
import styled from "styled-components"
import { IoMdArrowDown } from "react-icons/io";
import { useState } from "react";
import * as diff from "diff"
import Link from "next/link";

export const TitleH1 = styled.h1`

    font-size: 25px;
    padding: 20px 0px;
    margin-bottom: 20px;
    font-weight: 700;
`

const Td = styled.td`
    padding: 10px;
    margin-left: 30px;
    position: relative;
    vertical-align: top;
    border: solid 1px #cecece;
    white-space: pre-wrap;
    text-align: left;
    & div {
        min-width: 300px;
        max-width: 500px;
        word-break: break-all;
    }
`
const Num = styled(Td)`
    white-space: nowrap;
    & button{
        border: none;
        cursor: pointer;
        background-color: transparent;
    }
    & button:hover {
        background-color: #f1f1f1;
    }
    & span {
        width: 40px;
    }
`
const Table = styled.table`
    border: solid 1px #cecece;
    margin-top: 30px;
    border-collapse: collapse;
    border-radius: 10px;
    width: 100%;
    height: 100%;
    overflow: scroll;
    font-size: 13px;
    & thead {
        background-color: #f7f7f7;
    }
    & th {
        padding: 5px 10px;
        font-weight: 400;
        border-bottom: solid 1px #cecece;
    }
`
const Added = styled(Td)`
    border-left: solid 4px rgb(72, 255, 0);
    background-color: rgba(72, 255, 0,.2);
    width: 50%;
    & span {
        background-color: rgba(72, 255, 0,.2);
        position: relative;
    }
`

const Removed = styled(Td)`
    border-left: solid 4px rgb(255, 0, 0);
    background-color: rgba(255, 0, 0,.2);
    width: 50%;
    & span {
        background-color: rgba(255, 0, 0,.2);
        position: relative;
    }
`
const Reversion = styled.div`
    background-color: #f6f6f6;
    border: solid 1px #e5e5e5;
    border-radius: 5px;
    margin-top: 10px;
    padding: 7px;
    font-size: 13px;
    line-height: 18px;
    a {
        color: #2776af;
    }
`
const ListElem = (prop: { elem: any, index: number, part: number }) => {
    const { elem, index, part } = prop
    const [dropped, setDropped] = useState(elem.length != 1 || !(elem[0].value.length > 20))

    const DiffTxt = (props: { a: string, b: string, mode: "add" | "remove" }) => {
        const { a, b, mode } = props
        return (
            diff.diffChars(a, b).map((elem, index) => {
                if (elem.added)
                    return (mode == "add" ? <span>{elem.value}</span> :
                        <></>
                    )
                if (elem.removed)
                    return (mode == "remove" ? <span>{elem.value}</span> :
                        <></>
                    )
                else
                    return <>{elem.value}</>
            })
        )
    }
    return (
        <tr>
            <>
                <Num>
                    <span>
                        {index + part}
                        {elem[0].value.length > 20 ?
                            <button onClick={() => setDropped(!dropped)}>
                                <IoMdArrowDown style={{ rotate: dropped ? "180deg" : "0deg" }} />
                            </button> : <></>}
                    </span>
                </Num>
                {elem.length != 1 ?
                    <>
                        <Removed>
                            <div>
                                {
                                    dropped ?
                                        <DiffTxt a={elem[0].value} b={elem[1].value} mode="remove" /> : elem[0].value.slice(0, 20) + "..."
                                }
                            </div>
                        </Removed>
                        <Added>
                            <div>
                                {dropped ? <DiffTxt a={elem[0].value} b={elem[1].value} mode="add" /> : elem[1].value.slice(0, 20) + "..."}
                            </div>
                        </Added>
                    </>
                    : elem[0].removed ?
                        <>
                            <Removed>
                                <div>
                                    <span>
                                        {dropped ? elem[0].value : elem[0].value.slice(0, 20) + "..."}
                                    </span>
                                </div>
                            </Removed>
                            <Td><div /></Td>
                        </>
                        : elem[0].added ?
                            <>
                                <Td><div /></Td>
                                <Added>
                                    <div>
                                        <span>
                                            {dropped ? elem[0].value : elem[0].value.slice(0, 20) + "..."}
                                        </span>
                                    </div>
                                </Added>
                            </> : <>
                                <Td>
                                    <div>
                                        <span>
                                            {dropped ? elem[0].value : elem[0].value.slice(0, 20) + "..."}
                                        </span>
                                    </div></Td>
                                <Td><div /></Td>
                            </>
                }
            </>
        </tr>
    )
}

export const Compare = ({ beforeId,afterId,compareObject }: { compareObject: Change[],afterId:string,beforeId:string }) => {
    let isDeleted = false
    let a: any = []
    let g: any = []
    compareObject.forEach((elem, index) => {
        if (elem.removed) {
            isDeleted = true
            g.push({
                count: elem.count,
                removed: elem.removed,
                value: elem.value
            })
            if (index == compareObject.length - 1) {
                a.push(g)
                g=[]
            }
        } else if (isDeleted && elem.added) {
            g.push({
                count: elem.count,
                added: elem.added,
                value: elem.value
            })
            isDeleted = false
            a.push(g)
            g=[]
        } else {
            if (isDeleted) {
                a.push(g)
                g=[]
                isDeleted = false
            }
            a.push([{
                count: elem.count,
                added: elem.added,
                value: elem.value
            }])
        }

    })
    const sums = a.map((e: any) => e[0].count)
    return (
        <>
            <TitleH1>리비전 비교</TitleH1>
            <Reversion>
            {beforeId==afterId?"비교중인 리버전: "+beforeId+"(전, 후)":"비교중인 리버전: "+beforeId+", "+afterId}
            </Reversion>
            <Table>
                <thead>
                    <tr>
                        <th>줄</th>
                        <th>이전</th>
                        <th>이후</th>
                    </tr>
                </thead>
                <tbody>
                    {a.map((elem: any, index: number) =>
                        <ListElem key={index} elem={elem} index={index} part={sums.slice(0, index).reduce((b: any, a: any) => b + a, 0)} />
                    )}
                </tbody>
            </Table>
        </>
    )


}