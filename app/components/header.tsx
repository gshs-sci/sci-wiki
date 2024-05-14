import styled from "styled-components";
import { Playfair } from "next/font/google";

const playfair = Playfair({ subsets: ["latin"] });

const _Header = styled.header`
    list-style-type: none;
    border-bottom: solid 1px #cacaca;
`

const HeaderElement = styled.div`
    padding: 10px 0px;
    width: var(--cont-width);
    margin-left: auto;
    margin-right: auto;
    display: flex;
    align-items: center;
`

const Logo = styled.div`
    font-family: ${playfair.style.fontFamily};
    font-size: 25px;
`

export const Header = () => {
    return (<_Header>
        <HeaderElement>
        <Logo>
            SCI
        </Logo>
        </HeaderElement>
    </_Header>)
}