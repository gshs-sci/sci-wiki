"use client"
import Link from "next/link";
import styled from "styled-components";
const CharHolder = styled.ul`
    height: auto;
    min-height: 0;
    padding-left: 20px;
    margin: 10px 0px;
    width: calc((var(--cont-width) / 3) - 20px);
    & a {
        padding: 0;
        margin: 0;
        color: var(--color-link);
        text-decoration: none;
        &:hover {
            text-decoration: underline;
        }
    }
    & h3 {
        margin: 7px 0px;
    }
`
const Holder = styled.div`
    margin-left: auto;
    margin-right: auto;
    width: var(--cont-width);
    display: flex;
    flex-direction: column;

`
const RealHolder = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    flex-wrap: wrap;
    max-height:100vh;
`
export const Tags = (props: { tag: string, docs: Array<{ id: string, title: string, chosung: string }> }) => {
    const { docs, tag } = props
    let kv: { [key: string]: Array<{ id: string, title: string }> } = {}
    docs.forEach((elem) => {
        let { id, title, chosung } = elem
        if (chosung[0] in kv) {
            kv[chosung[0]].push({ id, title })
        } else {
            kv[chosung[0]] = [{ id, title }]
        }
    })
    return (
        <Holder>
            <h2>분류:{tag}에 속하는 문서</h2>
            <RealHolder>
                {
                    Object.keys(kv).map((key) => {
                        return (
                            <CharHolder key={key}>
                                <h3>{key}</h3>
                                {
                                    kv[key].map((elem) => {
                                        return (
                                            <li key={elem.id}>
                                                <Link href={"/d/" + elem.id}>{elem.title}</Link>
                                            </li>
                                        )
                                    })
                                }
                            </CharHolder>
                        )
                    })
                }
            </RealHolder>
        </Holder>
    )
}