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
    border-bottom: solid 1px #cacaca;
    padding: 15px 5px;
    & a {
        text-decoration: none;
        font-size: 18px;
        color: #000;
    }
    & a:hover {
        color: #2776af;
        text-decoration: underline;
    }
`
const ElemBody = styled.p`
    font-size: 13px;
    color:#6f6f6f;
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
    background-color: #fff;
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
    font-size: 12px;
    cursor: pointer;
    position: absolute;
}

`
const SearchBar = styled.input`
  padding: 10px 10px;
  font-size: 15px;
  border-radius: 0;
  border: solid 1px #848484;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  width: 100%;
`
const SearchBtn = styled.button`
  background-color: #fff;
  color:#000;
  border: solid 1px #000;
  border-left: none;
  font-size: 15px;
  padding: 9px 20px;
  border-radius: 0;
  white-space: nowrap;
  cursor: pointer;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  
`

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

export const SearchResult = (props: {
    query: string,
    cat: Array<{ id: string }>,
    activecat: string,
    count: number,
    data: Array<{
        title: string,
        id: string,
        subject: { id: string },
        lastupdated: string,
        preview: string
    }>
}) => {
    const { query, cat, count, data, activecat } = props
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
                    <SearchBar data-sug="true" autoComplete="off" type="text" name="q" defaultValue={query} onChange={(e)=>changeFn(e.target.value)}></SearchBar>
                    <select name="s">
                        <option value="" selected={activecat == "전체"}>전체</option>
                        {cat.map(elem => <option selected={activecat == elem.id} value={elem.id}>{elem.id}</option>)}
                    </select>
                    <Suggestion />
                </SearchBarInputHolder>
                <SearchBtn type="submit"><IoSearch /></SearchBtn>
            </SearchBarHolder>
            <Banner $normal={true}>제목이 "{query}"인 문서로 바로 이동하려면 <Link href={"/d/" + query}>여기</Link>를 클릭하세요.</Banner>
            <Holder>
                전체: {count}개
                {data.map((elem, index) => {
                    return (
                        <Elem>
                            <Link href={"/d/" + elem.id}>
                                {elem.title}
                            </Link>
                            <ElemBody>
                                {elem.preview}...
                            </ElemBody>
                        </Elem>
                    )
                })}
            </Holder>
        </Body>
    )
}