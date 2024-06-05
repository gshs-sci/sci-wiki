"use client"
import styled from "styled-components";
import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { Source_Code_Pro } from "next/font/google";
import { TbDots } from "react-icons/tb";

const sourceCodePro = Source_Code_Pro({ subsets: ["latin"], weight: "400" })

export const TitleH1 = styled.h1`

    font-size: 25px;
    padding: 20px 0px;
    margin-bottom: 20px;
    font-weight: 499;
`
const Holder = styled.ul`
    list-style-type: none;
    padding: 0;
    margin: 0;
    padding-left: 0px;
    margin-left: 20px;
    padding-top: 30px;
    padding-bottom: 30px;
    position: relative;
    &:before {
        content: "";
        height: 30px;
        width: 2px;
        background-color: #d1d1d1;
        position: absolute;
        top:0px;
        left: 30px;
    }
    &:after {
        content: "";
        height: 30px;
        width: 2px;
        background-color: #d1d1d1;
        position: absolute;
        bottom:0px;
        left: 30px;
    }
    &:last-of-type:after {
        display: none;
    }
`
const Date = styled.p`
    margin: 0;
    margin: 10px;
    font-size: 17px;
    color: #727272;
`
const Elem = styled.li`
border-bottom: solid 1px #dadada;
padding: 7px 20px;
display: flex;
flex-direction: column;
border-left: solid 1px #dadada;
border-right: solid 1px #dadada;
&:first-child {
    border-top: solid 1px #dadada;
}
& .bottom {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #757575;
}
& .bottom .id {
    margin: 0;
    padding: 5px;
    margin-right: 5px;
    color: #000;

}
& .bottom .date {
    margin: 0;
    padding: 0;
    margin-left: 5px;
    font-size: 12px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
& .top {
    display: flex;
    align-items: center;
}
a {
    text-decoration: none;
    color: #000;
}
a:hover {
    text-decoration: underline;
    color: #2776af;
}
.top .change {
    margin: 0;
    padding: 0;
    margin-left: 20px;
    font-size: 12px;
}
.top .change.red {
    color:red;
}

.top .change.green {
    color: green;
}
& .right {
    margin-left: auto;
    margin-right: 0;
    font-size: 12px;
    display: flex;
}
.menubtn {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 20px;
    cursor: pointer;
    font-size: 13px;
}
& .right .id {
    font-size: 12px;
    color: #828282;
    font-family: ${sourceCodePro.style.fontFamily};
}

`

interface Contribution {
    id: string,
    date: Date,
    docId: string,
    ip?: string,
    userId?: string,
    lengthDifference: number
}

export const Contribution = (props: { data: Array<Contribution>, forward?:boolean, backward?:boolean }) => {
    const [isDropped, setDropped] = useState(false)
    const {forward,backward} = props
    const { data } = props
    let fullData:
        {
            [key: string]:
            Array<Contribution>
        } = {}

    data.forEach((elem) => {
        let key = `${elem.date.getUTCFullYear()}년 ${elem.date.getUTCMonth() + 1}월 ${elem.date.getUTCDate()}일`
        if (key in fullData) {
            fullData[key].push(elem)
        } else {
            fullData[key] = [elem]
        }
    })
    return (<>
        {Object.keys(fullData).map((e) => {
            let elem = fullData[e]
            return (
                <Fragment key={e}>
                    <Date>{e}</Date>
                    <Holder>
                        {elem.map((data) => {
                            return (
                                <Elem key={data.id}>
                                    <div className="top">
                                        <Link href={`/d/${data.docId}`}>
                                            {data.docId}
                                        </Link>
                                        {data.lengthDifference > 0 ?
                                            <div className="change green">
                                                {"+" + data.lengthDifference}
                                            </div>
                                            :
                                            <div className="change red">
                                                {data.lengthDifference}
                                            </div>}
                                        <div className="right">
                                            <div className="id">
                                                {data.id.slice(16, -1)}
                                            </div>
                                            <div className="menubtn">
                                                <TbDots />
                                            </div>

                                        </div>
                                    </div>
                                    <div className="bottom">
                                        <p className="id">
                                            {data.userId ? data.userId : data.ip}
                                        </p>
                                        -
                                        <p className="date">
                                            {data.date.toUTCString()}
                                        </p>
                                    </div>
                                </Elem>)
                        })}
                    </Holder>
                </Fragment>
            )
        })}
        {forward?<Link href={"?from=" + data.slice(-1)[0].id}>다음 페이지</Link>:<></>}
        {backward?<Link href={"?until=" + data[0].id}>이전 페이지</Link>:<></>}
    </>)
}