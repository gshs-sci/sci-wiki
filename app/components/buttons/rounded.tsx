import styled from "styled-components";

const Button = styled.button`
    border-radius: 10px;
    background-color: #408cff;
    padding: 7px 20px;
    cursor: pointer;
    color:#fff;
    border: transparent;
`
export const RoundedButton = ({
    children,
    onClick
}: Readonly<{
    children: React.ReactNode;
    onClick: any;
}>) => {
    return (
        <Button onClick={onClick}>
            {children}
        </Button>
    )
}