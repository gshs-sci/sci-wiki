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