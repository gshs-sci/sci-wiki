import { useState, useEffect, ChangeEvent } from "react"
import { TitleSearch } from "./action"
import styled from "styled-components"
import Link from "next/link"

const SearchSuggestions = styled.ul`
    margin: 0;
    padding: 0;
    position: absolute;
    left: 0;
    background-color: #fff;
    width: calc(100% - 2px);
    border: solid 1px #848484;
    top: 50px;
    list-style-type: none;
    border-radius: 4px;
`
const Suggestions = styled.li`
    display: flex;
    flex-direction: column;
    margin: 5px;
    border: solid 1px transparent;
    border-radius: 3px;
    &:hover {
        border: solid 1px #dbdbdb;
        background-color: #f4f4f4;
        text-decoration: underline;
    }
    & a {
        padding:4px;
        color: #000;
        font-size: 14px;
        text-decoration: none;
    }
`

export const useSuggestion = (): [
    (value:string) => void,
    (props: any) => JSX.Element
] => {
    const [suggestion, setSug] = useState<Array<{ title: string, id: string }>>([])
    const [displayed, setDisplayed] = useState(false)

    const changeFn = (value:string) => {
        TitleSearch(value).then((res) => {
            setSug(res.data)
        })
    }
    const listner = (e: Event) => {
        if (!(e.target as HTMLTextAreaElement).matches("[data-sug=true], [data-sug=true] *")) {
            setDisplayed(false)
        }else {
            setDisplayed(true)
        }
    }
    useEffect(() => {
        addEventListener("click", listner)
        return () => removeEventListener("click", listner)
    }, [])
    useEffect(() => {
        if (suggestion.length > 0) {
            setDisplayed(true)
        } else {
            setDisplayed(false)
        }
    }, [suggestion])

    const Component = (props: any) => {
        return (
            <>
                {displayed && suggestion.length>0 ? <SearchSuggestions data-sug="true">
                    {suggestion?.map((elem) => {
                        return <Suggestions key={elem.id}>
                            <Link href={"/d/" + elem.id}>
                                {elem.title}
                            </Link>
                        </Suggestions>
                    })}
                </SearchSuggestions> : <></>}
            </>
        )
    }


    return [changeFn, Component]

}