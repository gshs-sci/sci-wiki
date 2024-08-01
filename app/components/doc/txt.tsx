"use client"
import Link from "next/link"
import styled from "styled-components"
import { BsLink45Deg } from "react-icons/bs";
import Image from "next/image";

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
    return ((url.indexOf(':') > -1 || url.indexOf('//') > -1) && checkDomain(location.href) !== checkDomain(url));
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

    if (isExternal(prop.href)) {
        return (
            <ExternalLink>
                <Link {...prop} >{prop.children}</Link>
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

    & img {
        object-fit: contain;
        width: unset!important;;
        max-width: 100%;
        height: unset !important;
        position: relative !important;
    }
`
export const Img = (props: { src: string, alt: string }) => {
    if(/^https:\/\/img\.sciwiki\.org(\/.*)?$/.test(props.src)) {
        return (
            <ImgHolder>
                <Image src={props.src} alt={props.alt} loading="lazy" fill />
            </ImgHolder>
        )
    }else {
        return (
            <ImgHolder>
                 <img src={props.src} alt={props.alt} loading="lazy"/>
             </ImgHolder>
        )
    }
}