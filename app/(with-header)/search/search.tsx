"use client"
import Link from "next/link"
import styled from "styled-components"
import { IoSearch } from "react-icons/io5"
import { Banner } from "@/app/components/doc/component";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSuggestion } from "@/app/components/search/suggestion";

const Body = styled.div`
  width: var(--cont-width);
  margin-left: auto;
  margin-right: auto;
  min-height: 100vh;
`

const Holder = styled.ul`
list-style-type: none;
display: flex;
flex-direction: column;
padding: 0;
margin: 0;
margin: 20px 0px;
`

const DocTitle = styled.h1`
    font-size: 25px;
    padding: 20px 0px;
`

const Elem = styled.li`
    margin: 0;
    padding: 0;
    border-bottom: solid 1px var(--color-border-primary);
    padding: 15px 5px;
    & a {
        text-decoration: none;
        font-size: 18px;
        color: var(--color-font-primary);
    }
    & a:hover {
        color: var(--color-link);
        text-decoration: underline;
    }
`
const ElemBody = styled.p`
    font-size: 13px;
    color:var(--color-font-secondary);
    padding: 5px 0px;
    margin: 0;
`

const SearchBarHolder = styled.form`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: flex-start;
  margin-top: 20px;
`
const SearchBarInputHolder = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 500px;
  & select:not([multiple]) {
    background-color: var(--color-background);
    border: none;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    padding: 3px;
    padding-right: 1.5em;
    right: 10px;
    font-size: 12px;
    cursor: pointer;
    position: absolute;
    color: var(--color-font-primary);
}

`
const SearchBar = styled.input`
  padding: 10px 10px;
  font-size: 15px;
  border-radius: 0;
  background-color: var(--color-background);
  color:var(--color-font-primary);
  border: solid 1px var(--color-border-primary);
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  width: 100%;
`
const SearchBtn = styled.button`
  background-color: var(--color-background);
  color:var(--color-font-primary);
  border: solid 1px var(--color-border-primary);
  border-left: none;
  font-size: 15px;
  padding: 9px 20px;
  border-radius: 0;
  white-space: nowrap;
  cursor: pointer;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  
`

const Navigation = styled.ul`
    list-style-type: none;
    display: flex;
    margin: 0;
    padding: 0;
    margin-top: 30px;
    & a {
        display: flex;
        width: 25px;
        height: 25px;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        color: #2776af;
    }
    & li {
        border: solid 1px transparent;
        border-radius: 3px;
    }
    & li.active {
        border: solid 1px #9a9a9a;
    }
`

export const SearchResult = (props: {
    query: string,
    cat: Array<{ id: string }>,
    activecat: string,
    count: number,
    page: number,
    data: Array<{
        title: string,
        id: string,
        subject: { id: string },
        lastupdated: string,
        preview: string
    }>
}) => {
    const { query, cat, count, data, activecat, page } = props
    console.log(page)
    const router = useRouter()
    const form = useRef<HTMLFormElement>(null)
    const [changeFn, Suggestion] = useSuggestion()

    const submit = (e: any) => {
        e.preventDefault()
        const f = new FormData(form.current!)
        let q = f.get("q")
        let s = f.get("s")
        router.push("/search?q=" + q + "&s=" + s)
    }
    return (
        <Body>
            <DocTitle>검색 결과</DocTitle>
            <SearchBarHolder onSubmit={submit} ref={form}>
                <SearchBarInputHolder>
                    <SearchBar data-sug="true" autoComplete="off" type="text" name="q" defaultValue={query} onChange={(e) => changeFn(e.target.value)}></SearchBar>
                    <select name="s">
                        <option value="" selected={activecat == "전체"}>전체</option>
                        {cat.map(elem => <option key={elem.id} selected={activecat == elem.id} value={elem.id}>{elem.id}</option>)}
                    </select>
                    <Suggestion />
                </SearchBarInputHolder>
                <SearchBtn type="submit"><IoSearch /></SearchBtn>
            </SearchBarHolder>
            <Banner $normal={true}>제목이 &quot;{query}&quot;인 문서로 바로 이동하려면 <Link href={"/d/" + encodeURIComponent(query)}>여기</Link>를 클릭하세요.</Banner>
            <Holder>
                전체: {count}개
                {data.map((elem, index) => {
                    return (
                        <Elem key={elem.id}>
                            <Link href={"/d/" + elem.id}>
                                {elem.title}
                            </Link>
                            <ElemBody>
                                {elem.preview}...
                            </ElemBody>
                        </Elem>
                    )
                })}
                <Navigation>
                    {Array(Math.ceil(count / 20)).fill(0).map((elem, index) => {
                        const d = new URLSearchParams(document.location.search)
                        d.set("page", String(index))

                        return (
                            <li className={index == page ? "active" : ""} key={index}>
                                <Link href={"/search?" + d.toString()}>
                                    {index}
                                </Link>
                            </li>
                        )
                    })}
                </Navigation>
            </Holder>
        </Body>
    )
}