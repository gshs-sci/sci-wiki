import styled from "styled-components"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { FetchCategory } from "./action"

const Holder = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 20px;
`
const Selector = styled.select`
    
    &:not([multiple]){
    background-color: #fff;
    border: solid 1px #cccccc;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-position: right 50%;
    background-repeat: no-repeat;
    background-image: url('data:image/svg+xml;utf8,<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="12" version="1"><path d="M4 8L0 4h8z"/></svg>');
    padding: 5px 10px;
    padding-right: 1.5em;
    right: 10px;
    font-size: 12px;
    border-radius: 3px;
    cursor: pointer;
}
`
const CreateBtn = styled.button`
    font-size: 12px;
    border-radius: 3px;
    background-color: #fff;
    border: solid 1px #cccccc;
    padding: 5px 10px;
    cursor: pointer;
    &:hover {
        background-color: #efefef;
    }
`
const CreateHolder = styled.div`
    position: relative;
    margin-left: 20px;
`
const Create = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: absolute;
    padding: 10px;
    background-color: #fff;
    border: solid 1px #cccccc;
    z-index: 10;
    margin-top: 10px;
    border-radius: 3px;
    & p {
        margin: 0px;
        font-size: 11px;
        color: #4f4f4f;
        line-height: 20px;
    }
    & b {
        font-weight: 500;
        font-size: 13px;
        color: #000000;
    }
    & input {
        padding: 5px 7px;
        border: solid 1px #cccccc;
        border-radius: 2px;
        margin-top: 5px;
    }
    & button {
        padding: 5px 10px;
        margin-top: 10px;
        font-size: 13px;
        border: none;
        background-color: #18891b;
        color: #fff;
        border-radius: 2px;
        cursor: pointer;
    }
`
export const Category = (props: { default?: string, isRequired: boolean, name: string }) => {
    const [categories, setCategories] = useState([])
    const [isShown, setShown] = useState(false)
    const [created, setCreated] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)
    const listner = (e: Event) => {
        if (!(e.target as HTMLTextAreaElement).matches("[data-create=true], [data-create=true] *")) {
            setShown(false)
        }
    }
    useEffect(() => {
        addEventListener("click", listner)
        return () => {
            removeEventListener("click", listner)
        }
    }, [])

    useEffect(() => {
        FetchCategory().then((data) => {
            setCategories(data)
        })
    }, [])
    const selectChanged = (e: ChangeEvent) => {
        const val = (e.target as HTMLSelectElement).value
        if (val != created) {
            setCreated("")
        }
    }
    return (
        <Holder>
            <Selector name={props.name} required={props.isRequired} onChange={selectChanged}>
                {created ? <option value={created} selected={true}>{created}</option> : <></>}
                {categories.map(elem => <option selected={props.default == elem} value={elem} key={elem}>{elem}</option>)}
            </Selector>
            <CreateHolder data-create={true}>
                <CreateBtn type="button" onClick={() => setShown(!isShown)}>+ 새로운 대분류 만들기</CreateBtn>
                {isShown ?
                    <Create>
                        <p><b>대분류명</b></p>
                        <input ref={inputRef} type="text"></input>
                        <button type="button" onClick={() => {
                            setCreated(inputRef.current!.value)
                        }}>확인</button>
                    </Create> : <></>}
            </CreateHolder>
        </Holder>
    )
}