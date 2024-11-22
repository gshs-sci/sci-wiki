"use client"
import styled from "styled-components"
import Link from "next/link"
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { useState, useEffect } from "react";
const Btns = styled.div`
    display: flex;
    margin-top: 20px;
`
const Holder = styled.div`
  width: var(--cont-width);
  margin-left: auto;
  margin-right: auto;
  min-height: 100vh;
  h1 {
    font-size: 25px;
    padding: 20px 0px;
    margin-bottom: 20px;
    font-weight: 700;
  }
`

const NavigationBtn = styled.button`
    color: var(--color-link);
    margin-right: 10px;
    background-color: transparent;
    border: none;
    padding: 7px 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    &:enabled {
        cursor: pointer;
    }
    &:disabled {
        color: var(--color-text-disabled);
    }
    &:enabled:hover {
        text-decoration: underline;
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
& a {
  border-bottom: solid 1px var(--color-border-primary);
  margin: 0;
  padding: 12px 5px;
  display: flex;
  cursor: pointer;
  align-items: baseline;
  color: inherit;
  text-decoration: none;
}
  &:hover {
    background-color: var(--color-background-hover);
  }
  & .title {
    margin-right: auto;
    margin: 0;
    padding: 0;
    font-size: 14px;
  }
  & .sub {
    margin: 0;
    padding: 0;
    font-size: 13px;
    color: var(--color-font-secondary);
    margin-right: 5px;
  }
  & .date {
    margin: 0;
    padding: 0;
    margin-right: 0;
    margin-left: auto;
    font-size: 12px;
    color: var(--color-font-secondary);
  }
`
const TimeDifference = (props: { time: Date }) => {
    const [displayTime, setDisplay] = useState(false)
    useEffect(() => {
        setDisplay(true)
    }, [])
    if (!displayTime) {
        return <></>
    }
    const offset = Date.now() - props.time.getTime()
    if (offset / 1000 < 60) {
        return <>{Math.floor(offset / 1000)}초 전</>
    } else if (Math.floor(offset / 60000) < 60) {
        return <>{Math.floor(offset / 60000)}분 전</>
    } else if (Math.floor(offset / 3600000) < 24) {
        return <>{Math.floor(offset / 3600000)}시간 전</>
    } else {
        return <>{Math.floor(offset / 86400000)}일 전</>
    }
}

export const Recents = (props: {
    docs: Array<{ title: string, id: string, lastUpdated: Date,subject:{id:string} }>,
    next: boolean,
    prev: boolean
}) => {
    const { next, prev, docs } = props
    return (
        <Holder>
            <h1>최근 수정된 문서</h1>
            <DisplayH>                        
                {docs.map((elem, index) => {
                return (
                    <HDoc key={elem.id + index}>
                        <Link href={"/d/" + elem.id}>
                            <p className="title">{elem.title}</p>
                            <p className="date"><TimeDifference time={elem.lastUpdated} /></p>
                        </Link>
                    </HDoc>)
            })}

            </DisplayH>
            <Btns>
                <Link style={{ textDecoration: "none" }} href={prev ? "?until=" + docs[0].id : ""}><NavigationBtn disabled={!prev}><MdNavigateBefore />이전 페이지</NavigationBtn></Link>
                <Link style={{ textDecoration: "none" }} href={next ? "?from=" + docs.slice(-1)[0].id : ""}> <NavigationBtn disabled={!next}>다음 페이지 <MdNavigateNext /></NavigationBtn></Link>
            </Btns>
        </Holder>
    )
}