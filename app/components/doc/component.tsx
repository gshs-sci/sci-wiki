"use client"

import styled from "styled-components"

export const Banner = styled.div<{$normal?:boolean}>`
    background-color: ${props=>props.$normal?"#f6f6f6":"#fffdc7"};
    border: solid 1px #e5e5e5;
    border-radius: 5px;
    margin-top: 20px;
    padding: 8px;
    font-size: 13px;
    line-height: 18px;
    a {
        color: #2776af;
    }
`

export const Title = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    & h1 {
        margin:0;
        margin-top: 20px;
    }
    p.date {
        margin: 0;
        color: #7e7e7e;
        margin: 5px 0px;
    }
    div.right {
        margin-left: auto;
        margin-right: 0;
    }
    div.left {
        display: flex;
        flex-direction: column;
    }
    a {
        font-size: 15px;
        margin-left: 10px;
        color: #2776af;
    }
    @media(max-width: 800px) {
        flex-direction: column;
        align-items: flex-start;
    }
`

export const Tags = styled.ul`
    list-style-type: none;
    font-size: 13px;
    padding: 0;
    margin: 0;
    padding: 3px 8px;
    background-color: transparent;
    border: solid 1px #e0e0e0;
    display: flex;
    align-items: center;
    margin-top: 20px;
    border-radius: 5px;
    white-space: nowrap;
    flex-wrap: wrap;
    & li.main {
        height: 13px;
        font-weight: 600;
        border: none;
        margin: 0px 5px;
        color: #000000;
        &:after {
            width: 5px;
            height: 5px;
            margin-left: 5px;
            content: "";
            border: solid 1px #a5a5a5;
            border-left: none;
            border-bottom: none;
            rotate: 45deg;
        }
        
    }
    & li {
        margin: 5px 0px;
        display: flex;
        align-items: center;
        color: #cccccc;
        margin-right: 10px;
        padding-right: 10px;
        border-right: solid 1px #cccccc;
        height: 13px;
        display: flex;
        align-items: center;
    }
    & li:last-child {
        border-right: none;
    }
    & a {
        padding: 0;
        margin: 0;
        color: #2776af;
        text-decoration: none;
        &:hover {
            text-decoration: underline;
        }
    }
    & p {
        font-size: 13px;
        margin: 0;
        padding: 0;
    }
`