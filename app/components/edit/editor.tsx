"use client"
import styled from "styled-components";
import { AiFillFileMarkdown } from "react-icons/ai";
import { Edit } from "./action";
import { useFormStatus } from "react-dom";

export const Ta = styled.textarea`
    resize: vertical;
    height: 500px;
    border-radius: 0px;
    border: solid 1px #4d4d4d;
`
const ModeChange = styled.div`
    display: flex;
    justify-content: flex-start;
    margin-bottom: -1px;
`
const ModeChangeBtn = styled.button`
    border-radius: 0;
    background-color: #fff;
    border: none;
    cursor: pointer;
    padding: 7px 10px;
    margin-right: 10px;
    color: #000;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    border: solid 1px #4d4d4d;
    border-bottom: none;
    z-index: 2;
    display: flex;
    align-items: center;
    & span {
        margin-right: 5px;
    }
`
const BottomBtns = styled.div`
    display: flex;   
    margin-top: 20px;
    justify-content: space-between;
`
const SubmitBtn = styled.button`
    padding: 7px 10px;
    border-radius: 3px;
    border: none;
    background-color: #000000;
    color: #fff;
    cursor: pointer;
`
const DelBtn = styled.button`
    background-color: transparent;
    color: #c90000;
    border: none;
    cursor: pointer;
`
const SubmitButtons = () => {
    const { pending } = useFormStatus()
    return (
        <BottomBtns>
            <SubmitBtn type="submit" disabled={pending}>
                {pending ? "저장중.." : "변경사항 적용하기"}
            </SubmitBtn>
            <DelBtn type="button">문서 삭제하기</DelBtn>
        </BottomBtns>
    )
}
export const Textarea = (props: { title: string, defaultValue: string, id?: string }) => {
    const { title, ...prop } = props
    return (
        <>
            <h1>{title}</h1>
            <form action={Edit}>
                <ModeChange>
                    <ModeChangeBtn type="button">
                        <span>
                            <AiFillFileMarkdown />
                        </span>
                        RAW 편집
                    </ModeChangeBtn>
                </ModeChange>
                {props.id ? <input type="hidden" name="docId" defaultValue={props.id} /> : <></>}
                <Ta {...prop} spellCheck={false} name="data" />
                <SubmitButtons />
            </form>
        </>
    )
}