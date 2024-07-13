"use client"
import { Config } from "@/app/lib/permission"
import styled from "styled-components"
import { RxCross2 } from "react-icons/rx";
import { Banner } from "@/app/components/doc/component";
import { Fragment, useState } from "react";
import { Apply } from "./action";
import { useFormState, useFormStatus } from "react-dom";

const Holder = styled.form`
    display: flex;
    flex-direction: column;
    width: 100%;
`
const Entries = styled.ul`
    display: flex;
    flex-direction: column;
    list-style-type: none;
    padding: 0;
    border-radius: 5px;
    padding: 5px 0px;
`
const Entry = styled.li`
    padding: 0px 10px;
    height: 41px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    border: solid 1px var(--color-border-primary);
    margin-bottom: 10px;
    border-radius: 3px;
    color: var(--color-font-primary);
    & input[type="checkbox"] {
        accent-color: var(--color-link);
    }
`
const ConditionEntry = styled(Entry)`
    padding: 0;
    flex-direction: row;
    height: auto;
    margin: 0;
    margin-bottom: 0px;
    border: none;
    justify-content: space-between;
    @media(max-width: 800px) {
        margin-bottom: 20px;
        flex-direction: column;
    }
    
`
const ConditionalBox = styled.div`
    display: flex;
    border-radius: 3px;
    height: 41px;
    padding: 0px 7px;
    border: solid 1px var(--color-border-primary);
    width: 50%;
    @media(max-width: 800px) {
        flex-direction: column;
        width: calc(100% - 14px);
    }
`
const Condition = styled(ConditionalBox)`
align-items: center;
& button {
    border: solid 1px var(--color-border-secondary);
    color: var(--color-font-secondary);
    border-radius: 5px;
    cursor: pointer;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 15px;
    font-size: 13px;
    height: 15px;
    padding: 0;
    margin-right: 10px;
}
& select:not([multiple]) {
    background-color: var(--color-background);
    border: none;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-position: right 50%;
    background-repeat: no-repeat;
    background-image: url('data:image/svg+xml;utf8,<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="12" version="1"><path d="M4 8L0 4h8z"/></svg>');
    padding: 3px;
    padding-right: 1.5em;
    right: 10px;
    font-size: 14px;
    cursor: pointer;
    color: var(--color-font-primary);
}
& select:focus {
    outline: none;
}
& input[type='text'] {
    border: none;
    margin-right: 0;
    margin-left: auto;
    text-align: end;
    padding: 5px 2px;
    width: 100%;
    background-color: transparent;
    color: var(--color-font-primary);
}
& input[type='text']:focus {
    outline: none;
}
@media(max-width: 800px) {
    flex-direction: row;
}
`
const Permission = styled(ConditionalBox)`
    position: relative;
    margin-top: 10px;
    margin-bottom: 10px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-left: 9px;
    &:before {
        content: "";
        position: absolute;
        top: 50%;
        height: 1px;
        width: 10px;
        left: -10px;
        background-color: var(--color-border-primary);
    }
    @media(max-width: 800px) {
        margin-left: 0px;
        flex-direction: row;
        &:before {
            content: "";
            position: absolute;
            left: 50%;
            width: 1px;
            height: 10px;
            top:-11px;
            background-color: var(--color-border-primary);
        }
    }
    
`
const Perm = styled.span`
    background-color: var(--color-background);
    color: var(--color-link);
    padding: 0px 7px;
    height: 21.5px;
    padding-right: 25px;
    right: 10px;
    font-size: 12px;
    border-radius: 20px;
    margin-left: 10px;
    position: relative;
    display: flex;
    align-items: center;
    & span {
        border-radius: 20px;
        width: 13px;
        height: 13px;
        font-size: 10px;
        line-height: 10px;
        position: absolute;
        background-color: rgba(39, 118, 175,.5);
        right: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-background);
        cursor: pointer;
    }
`

const SaveArea = styled.div`
    display: flex;
    & button {
        padding: 7px 10px;
    border-radius: 3px;
    border: none;
    background-color: var(--color-button-background);
    color: var(--color-button-text);
    cursor: pointer;
    font-size: 13px;
    }
    justify-content: flex-end;
`

const AddPerm = styled.div`
    position: relative;
    font-size: 13px;
    color: var(--color-font-secondary);
    cursor: pointer;
    &:hover {
        overflow: visible;
    }
    overflow: hidden;
    & ul {
        color: var(--color-font-primary);
        position: absolute;
        background-color: var(--color-background);
        z-index: 1;
        list-style-type: none;
        padding: 0;
        padding: 3px;
        border: solid 1px var(--color-border-primary);
        border-radius: 3px;
        right: 0;
    }
    & li {
        padding: 2px 6px;
        cursor: pointer;
        font-size: 13px;
    }
    & li:hover {
        background-color: var(--color-background-hover);
    }

`
const AdditionBtn = styled.button`
    padding: 7px 10px;
    border-radius: 3px;
    border: none;
    color: var(--color-font-secondary);
    cursor: pointer;
    font-size: 13px;
    background-color: transparent;
    text-align: start;
    padding: 0;
    margin: 10px 3px;
    &:hover {
        color: var(--color-font-primary);
    }
`

const SubmitBtn = (props: { submit: boolean | undefined }) => {
    const { pending } = useFormStatus()
    return (
        <SaveArea>
            <button type="submit" disabled={pending} >
                {pending ? "적용중.." : typeof props.submit !== "undefined" ? props.submit ? "저장됨" : "저장하지 못함" : "변경사항 저장"}
            </button>
        </SaveArea>
    )
}
export const ConfigPage = (props: { config: Config }) => {
    const { config } = props
    const [condition, setCondition] = useState(config.conditional_permission)
    const [state, formAction] = useFormState(Apply, null)

    return (
        <Holder action={formAction}>
            <h2>전역 권한</h2>
            <Banner $normal={true}>모든 사용자(로그인되지 않은 사용자 포함)에게 아래 권한을 부여합니다:</Banner>
            <Entries>
                <Entry>
                    문서 생성 허용
                    <input
                        type="checkbox"
                        name="create"
                        defaultChecked={config.allow_unauthorized_create}
                    />
                </Entry>
                <Entry>
                    문서 삭제 허용
                    <input
                        type="checkbox"
                        name="delete"
                        defaultChecked={config.allow_unauthorized_delete}
                    />
                </Entry>
                <Entry>
                    문서 편집 허용
                    <input
                        type="checkbox"
                        name="edit"
                        defaultChecked={config.allow_unauthorized_edit}
                    />
                </Entry>
            </Entries>
            <h2>조건부 권한</h2>
            <Banner $normal={true}>조건을 만족하는 사용자에게 아래 권한을 부여합니다:</Banner>
            <Entries>
                {condition.map((elem, i) => {
                    return (
                        <ConditionEntry key={i}>
                            <Condition>
                                <button type="button" onClick={() => {
                                    setCondition(condition.filter((e, ind) => ind !== i))
                                }}>
                                    <RxCross2 />
                                </button>
                                <select defaultValue={Object.keys(elem.condition)[0]} name={"condition[" + i + "]['property']"}>
                                    <option value="email">이메일</option>
                                    <option value="id">아이디</option>
                                </select>
                                <input type="text"
                                    placeholder="정규표현식 입력"
                                    defaultValue={Object.values(elem.condition)[0]}
                                    name={"condition[" + i + "]['regex']"} />

                            </Condition>
                            <Permission>
                                {elem.permission.map((perm, i2) => {
                                    return (
                                        <Fragment key={i + "-" + i2 + "-" + perm}>
                                            <Perm >{perm}<span
                                                onClick={() => {
                                                    setCondition(
                                                        (data) => {
                                                            let newdata = data.slice()
                                                            newdata.find((_, index) => index == i)!.permission = elem.permission.filter(e => e !== perm);
                                                            return newdata
                                                        })
                                                }}
                                            ><RxCross2 /></span></Perm>
                                            <input
                                                type="hidden"
                                                name={"condition[" + i + "]['perm'][" + i2 + "]"}
                                                value={perm} />
                                        </Fragment>
                                    )
                                })}
                                <AddPerm>
                                    + 추가
                                    <ul>
                                        {["create", "edit", "delete", "admin"].filter(perm => elem.permission.indexOf(perm as any) == -1).map(e =>
                                            <li key={e + "dropdown"} onClick={() => {
                                                setCondition(
                                                    (data) => {
                                                        let newdata = JSON.parse(JSON.stringify(data)) //deep copy to avoid react strictmode invoking setstate twice
                                                        newdata.find((_: any, index: number) => index == i)!.permission.push(e as any)
                                                        return newdata
                                                    })
                                            }
                                            }>{e}</li>
                                        )}
                                    </ul>
                                </AddPerm>
                            </Permission>
                        </ConditionEntry>
                    )
                })}
                <AdditionBtn type="button" onClick={() => {
                    setCondition((data) => {
                        return [...data, { condition: {}, permission: [] }]
                    })
                }}>+ 추가하기</AdditionBtn>
            </Entries>
            <SubmitBtn submit={state?.success} />
        </Holder>
    )
}