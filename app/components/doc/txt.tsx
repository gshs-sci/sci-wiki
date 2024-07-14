"use client"
import Link from "next/link"
import styled from "styled-components"
export const H2Elem = (prop: any) => {
    return (
        <div id={prop.id} data-type="md-title">
            <h2>{prop.children}</h2>
        </div>
    )
}

export const H3Elem = (prop: any) => {
    return (
        <div id={prop.id} data-type="md-title">
            <h3>{prop.children}</h3>
        </div>
    )
}
export const H4Elem = (prop: any) => {
    return (
        <div id={prop.id} data-type="md-title">
            <h3>{prop.children}</h3>
        </div>
    )
}
export const H5Elem = (prop: any) => {
    return (
        <div id={prop.id} data-type="md-title">
            <h3>{prop.children}</h3>
        </div>
    )
}
export const H6Elem = (prop: any) => {
    return (
        <div id={prop.id} data-type="md-title">
            <h3>{prop.children}</h3>
        </div>
    )
}
export const AElem = (prop: any) => {
    
    if (prop["data-footnote-ref"]==true || prop["data-footnote-ref"]=="") {
        const { href, ...d } = prop
        return (
            <Link {...d} href={href?"#sci-" + href.slice(1):"#"}>{prop.children}</Link>
        )
    }else if(prop["data-footnote-backref"]=="") {
        const { href, ...d } = prop
        return (
            <Link {...d} href={href?"#sci-" + href.slice(1):"#"}>&uarr;</Link>
        )
    }
    return (
        <Link {...prop} >{prop.children}</Link>
    )
}

const Section = styled.section`
    border-top: solid 1px var(--color-border-secondary);
    & h2 {
        margin-top: 24px;
        margin-bottom: 16px;
        font-size: 18px;
        color: var(--color-font-secondary);
    }
`
export const SectionElem = (prop:any) => {
    if(prop["data-footnotes"]==true||prop["data-footnotes"]=="") {
        return (
            <Section>
                {prop.children}
            </Section>
        )
    }else {
        return <section {...prop}/>
    }
}