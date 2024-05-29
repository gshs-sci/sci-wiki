"use client"
import styled from "styled-components";
import { Noto_Serif_KR } from "next/font/google";
import { Noto_Sans_KR } from "next/font/google";
import { IoSearch } from "react-icons/io5";
import { useState } from "react";

import Image from "next/image";
const serifNormal = Noto_Serif_KR({ weight: "400", subsets: ["latin"] })
const serifBold = Noto_Serif_KR({ weight: "600", subsets: ["latin"] })
const sansBold = Noto_Sans_KR({ weight: "600", subsets: ["latin"] })
const Body = styled.div`
  width: var(--cont-width);
  margin-left: auto;
  margin-right: auto;
`

const SearchArea = styled.section`
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-start;
padding: 100px 0px;
@media(max-width: 1100px) {
  flex-direction: column;
  align-items: flex-start;
}
& h1 {
  font-size: 27px;
  font-family: ${sansBold.style.fontFamily};
  max-width: 300px;
  margin: 0;
}
& p {
  color: #7a7a7a;
}
`
const SearchTexts = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`
const SearchImg = styled.div`
  margin-left: 100px;
  @media(max-width: 1100px) {
    margin: 0;
  }
`
const SearchBarHolder = styled.div`
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
  background-color: #000;
  color:#fff;
  font-size: 15px;
  padding: 10px 20px;
  border-radius: 0;
  border: none;
  white-space: nowrap;
  cursor: pointer;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
`

const DisplayDocs = styled.ul`
margin: 0;
padding: 0;
list-style-type: none;
display: flex;
flex-wrap: wrap;
`
const Doc = styled.li`
  padding: 10px 17px;
  border-radius: 5px;
  border: solid 1px #cecece;
  width: 150px;
  font-family: ${serifBold.style.fontFamily};
  display: flex;
  flex-direction: column;
  margin-right: 10px;
  margin-bottom: 10px;
  flex-shrink: 0;
  & .sub {
    color: #a4a4a4;
    padding: 0;
    margin: 0;
    font-size: 12px;
    font-family: ${sansBold.style.fontFamily};
  }
`
const DisplayH = styled.ul`
margin: 0;
padding: 0;
list-style-type: none;
display: flex;
flex-direction: column;
margin-top: 20px;
`
const HDoc = styled.li`
  border-bottom: solid 1px #cecece;
  margin: 0;
  padding: 10px 5px;
  display: flex;
  cursor: pointer;
  align-items: baseline;
  &:hover {
    background-color: #ededed;
  }
  & .title {
    margin-right: auto;
    margin: 0;
    padding: 0;
    font-size: 15px;
    font-family: ${serifNormal.style.fontFamily};
  }
  & .sub {
    margin: 0;
    padding: 0;
    font-size: 13px;
    color: #a4a4a4;
    margin-right: 5px;
  }
  & .date {
    margin: 0;
    padding: 0;
    margin-right: 0;
    margin-left: auto;
    font-size: 12px;
    color: #555555;
  }
`
export default function MainPage() {
  const [activeElem, setActive] = useState(0)
  return (
    <Body>
      <SearchArea>
        <SearchTexts>
        <h1>
          과학, 수학, 정보에 특화된 문서를 제공합니다
        </h1>
        <p>모르는 정보를 검색해 보세요</p>
        <SearchBarHolder>
          <SearchBarInputHolder>
            <SearchBar type="text"></SearchBar>
            <select name="pets" id="pet-select">
              <option value="">전체</option>
              <option value="math">수학</option>
              <option value="physics">물리</option>
              <option value="biology">생명과학</option>
              <option value="astrology">천문</option>
              <option value="informatics">정보과학</option>
            </select>
          </SearchBarInputHolder>

          <SearchBtn><IoSearch /></SearchBtn>
        </SearchBarHolder>
        </SearchTexts>
        <SearchImg>
          <Image src="/undraw_connected_world_wuay.svg" alt="globe" width={280} height={280}></Image>
        </SearchImg>
      </SearchArea>
      <DisplayH>
      <h3>새로 업데이트된 문서</h3>
        <HDoc>
          <p className="sub">물리학 &gt;</p>
          <p className="title">집가는법</p>
          <p className="date">1시간 전</p>
        </HDoc>
        <HDoc>
          <p className="sub">천문학 &gt;</p>
          <p className="title">집가는법</p>
          <p className="date">1시간 전</p>
        </HDoc>
        <HDoc>
          <p className="sub">생명과학 &gt;</p>
          <p className="sub">실험 &gt;</p>
          <p className="title">Disk Diffusion Test</p>
          <p className="date">1시간 전</p>
        </HDoc>
        <HDoc>
          <p className="sub">생명과학 &gt;</p>
          <p className="sub">실험 &gt;</p>
          <p className="title">Disk Diffusion Test</p>
          <p className="date">1시간 전</p>
        </HDoc>
        <HDoc>
          <p className="sub">생명과학 &gt;</p>
          <p className="sub">실험 &gt;</p>
          <p className="title">Disk Diffusion Test</p>
          <p className="date">1시간 전</p>
        </HDoc>
        <HDoc>
          <p className="sub">생명과학 &gt;</p>
          <p className="sub">실험 &gt;</p>
          <p className="title">Disk Diffusion Test</p>
          <p className="date">1시간 전</p>
        </HDoc>
        <HDoc>
          <p className="sub">생명과학 &gt;</p>
          <p className="sub">실험 &gt;</p>
          <p className="title">Disk Diffusion Test</p>
          <p className="date">1시간 전</p>
        </HDoc>
        <HDoc>
          <p className="sub">생명과학 &gt;</p>
          <p className="sub">실험 &gt;</p>
          <p className="title">Disk Diffusion Test</p>
          <p className="date">1시간 전</p>
        </HDoc>
        <HDoc>
          <p className="sub">생명과학 &gt;</p>
          <p className="sub">실험 &gt;</p>
          <p className="title">Disk Diffusion Test</p>
          <p className="date">1시간 전</p>
        </HDoc>
      </DisplayH>
    </Body>
  )
}