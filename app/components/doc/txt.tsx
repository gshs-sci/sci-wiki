"use client"
import Link from "next/link"
import styled from "styled-components"
import { BsLink45Deg } from "react-icons/bs";
import Image from "next/image";
import { useEffect, useState } from "react";
import bs58 from 'bs58'

export const H2Elem = (prop: any) => {
    return (
        <div id={prop.id} data-type="md-title">
            <h2>{prop.children}</h2>
        </div>
    )
}

var checkDomain = function (url: string) {
    if (url.indexOf('//') === 0) { url = location.protocol + url; }
    return url.toLowerCase().replace(/([a-z])?:\/\//, '$1').split('/')[0];
};

var isExternal = function (url: string) {
    return ((url.indexOf(':') > -1 || url.indexOf('//') > -1) && checkDomain(window.location.href) !== checkDomain(url));
};

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

const InternalLink = styled.span`
    & a {
        color: var(--color-link);
    }
`
const ExternalLink = styled.span`
    & a {
        color: #007812;
    }

`
export const AElem = (prop: any) => {
    const [external,setExternal] = useState(false)

    useEffect(()=>{
        setExternal(isExternal(prop.href))
    },[])

    if(!prop.href) return <a {...prop}/>

    if (external) {
        return (
            <ExternalLink>
                <Link {...prop}>{prop.children}</Link>
            </ExternalLink>
        )
    } else {
        if (prop["data-footnote-ref"] == true || prop["data-footnote-ref"] == "") {
            const { href, ...d } = prop
            return (
                <Link {...d} href={href ? "#sci-" + href.slice(1) : "#"}>{prop.children}</Link>
            )
        } else if (prop["data-footnote-backref"] == "") {
            const { href, ...d } = prop
            return (
                <Link {...d} href={href ? "#sci-" + href.slice(1) : "#"}>&uarr;</Link>
            )
        }
        return (
            <InternalLink>
                <Link {...prop} >{prop.children}</Link>
            </InternalLink>
        )
    }
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
export const SectionElem = (prop: any) => {
    if (prop["data-footnotes"] == true || prop["data-footnotes"] == "") {
        return (
            <Section>
                {prop.children}
            </Section>
        )
    } else {
        return <section {...prop} />
    }
}

const ImgHolder = styled.span`
    width: 100%;
    position: relative;
    display: block;

    & img {
        object-fit: contain;
        width: unset!important;;
        max-width: 100%;
        height: unset !important;
        position: relative;
        top:0;
        left: 0;
    }
    & img.real {
        position: absolute;
        top:0;
        left: 0;
    }
`
export const Img = (props: { src: string, alt: string }) => {
    if(/^https:\/\/img\.sciwiki\.org(\/.*)?$/.test(props.src)) {
        try{
            const dec = new TextDecoder()
            const plain = dec.decode(bs58.decodeUnsafe(new URL(props.src).pathname.split("/")[1].split("_")[0])).split("w")[1].split("h")
            const imgsize = [parseInt(plain[0]), parseInt(plain[1].split("t")[0])]
            const d = btoa(`<svg width="${imgsize[0]}" height="${imgsize[1]}" xmlns="http://www.w3.org/2000/svg" />`)

            return (
                <ImgHolder>
                <img {...props} src={`data:image/svg+xml;base64,${d}`} />
                <img className="real" {...props} src={props.src} alt={props.alt} width={imgsize[0]} height={imgsize[1]} loading="lazy" />
                </ImgHolder>
            )
        }catch(e){
            return (
                <ImgHolder>
                    <img src={props.src} alt={props.alt} loading="lazy" />
                </ImgHolder>
            )
        }
    }
}