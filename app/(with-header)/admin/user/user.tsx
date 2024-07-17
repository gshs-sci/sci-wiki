"use client"

import styled from "styled-components"
import Link from "next/link"
import { MdNavigateNext, MdNavigateBefore, MdMoreVert } from "react-icons/md";
import { DeleteUser, SetUserPermission } from "./action";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IoSearch } from "react-icons/io5";
import * as NProgress from "nprogress";

interface User {
    id: string,
    email: string,
    registered: Date,
    deletePermission: boolean,
    createPermission: boolean,
    editPermission: boolean,
    isAdmin: boolean
}

const Holder = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`
const Btns = styled.div`
    display: flex;
    margin-top: 20px;
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
font-size: 14px;
`

const User = styled.li`
    border-bottom: solid 1px var(--color-border-secondary);
    padding: 10px 5px;
    display: flex;
    color: var(--color-font-secondary);
    & .user {
        margin-right: auto;
        margin-left: 0;
        color: var(--color-font-primary);
    }
    & a {
        color: var(--color-link);
    }
    & .email {
        max-width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`

const MenuAndPermission = styled.span`
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
        overflow: visible;
    }
`
const Dropdown = styled.div`
    border-radius: 5px;
    user-select: none;
    display: flex;
    flex-direction: column;
    position: absolute;
    background-color: var(--color-background);
    right: 0;
    white-space: nowrap;
    padding: 10px;
    border: solid 1px var(--color-border-primary);
    z-index: 5;
    top: 21px;
    & label {
        display: flex;
        justify-content: flex-end;
        padding: 3px 5px;
    }
`
const DroppedMenu = styled.ul`
    list-style-type: none;
    padding: 0;
    font-size: 13px;
    &:nth-child(2) {
        border-top: solid 1px var(--color-border-secondary);
        padding-top: 5px;
        margin-top: 5px;
    }
    & li {
        cursor: pointer;
    }
    & li:hover {
        background-color: var(--color-background-hover);
    }
`

const Menu = styled.span`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 20px;
`

const Checkbox = styled.input`
    accent-color: transparent;
    border: none;
    margin-left: 10px;
    background-color: transparent;
`

const SearchBar = styled.input`
  padding: 10px 10px;
  font-size: 15px;
  border-radius: 0;
  background-color: var(--color-background);
  color:var(--color-font-primary);
  border: solid 1px var(--color-border-primary);
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  width: 100%;
`
const SearchBtn = styled.button`
  background-color: var(--color-background);
  color:var(--color-font-primary);
  border: solid 1px var(--color-border-primary);
  border-left: none;
  font-size: 15px;
  padding: 9px 20px;
  border-radius: 0;
  white-space: nowrap;
  cursor: pointer;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  
`
const SearchBarHolder = styled.form`
display: flex;
flex-direction: row;
width: 100%;
justify-content: flex-start;
margin-top: 20px;
`
const SearchBarInputHolder = styled.div`
position: relative;
display: flex;
align-items: center;
width: 500px;
& select:not([multiple]) {
  background-color: var(--color-background);
  border: none;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding: 3px;
  padding-right: 1.5em;
  right: 10px;
  font-size: 12px;
  cursor: pointer;
  position: absolute;
  color: var(--color-font-primary);
}

`
const InputCheckBox = (props:
    {
        deletePermission: boolean,
        createPermission: boolean,
        editPermission: boolean,
        isAdmin: boolean,
        user: string
    }) => {
    const [confirmDelete, setConfirm] = useState(false)
    const [deleting, setdeleting] = useState(false)
    const router = useRouter()
    const checked = async (e: Event, action: "create" | "delete" | "edit" | "admin") => {
        e.preventDefault()
        const res = await SetUserPermission(action, (e.target as HTMLInputElement).checked, props.user)
        if (res.success) {
            (e.target as HTMLInputElement).checked = res.checked as boolean
        }
    }
    const deleteusr = () => {
        if (!confirmDelete) {
            setConfirm(true)
            return
        }
        setdeleting(true)
        DeleteUser(props.user).then(() => {
            setdeleting(false)
            router.refresh()
        })
    }
    return (
        <MenuAndPermission>
            <Menu>
                <MdMoreVert />
            </Menu>
            <Dropdown>
                <DroppedMenu>
                    <li>
                        <label htmlFor={props.user + "del"}>
                            삭제
                            <Checkbox type="checkbox" id={props.user + "del"} defaultChecked={props.deletePermission} onChange={(e) => checked(e, "delete")}></Checkbox>
                        </label>
                    </li>
                    <li>
                        <label htmlFor={props.user + "gen"}>
                            생성
                            <Checkbox type="checkbox" id={props.user + "gen"} defaultChecked={props.createPermission} onChange={(e) => checked(e, "create")}></Checkbox>
                        </label>
                    </li>
                    <li>
                        <label htmlFor={props.user + "edit"}>
                            수정
                            <Checkbox type="checkbox" id={props.user + "edit"} defaultChecked={props.editPermission} onChange={(e) => checked(e, "edit")}></Checkbox>
                        </label>
                    </li>
                    <li>
                        <label htmlFor={props.user + "adm"}>
                            관리자
                            <Checkbox type="checkbox" id={props.user + "adm"} defaultChecked={props.isAdmin} onChange={(e) => checked(e, "admin")}></Checkbox>
                        </label>
                    </li>
                </DroppedMenu>
                <DroppedMenu>
                    <li onClick={deleteusr}>{deleting ? "삭제중.." : confirmDelete ? "정말 삭제할까요?" : "사용자 계정 삭제"}</li>
                </DroppedMenu>
            </Dropdown>
        </MenuAndPermission>
    )
}

export const ManageUser = (props: { users: Array<User>, forward: boolean, backward: boolean, search:string|undefined }) => {

    const d = new URLSearchParams(document.location.search)
    const { users, forward, backward } = props
    const form = useRef()
    const router = useRouter()

    const submit = (e: any) => {
        e.preventDefault()
        const f = new FormData(form.current!)
        let q = f.get("q")
        NProgress.start()
        router.push("/admin/user?search=" + q)
    }
    return (
        <Holder>
            <h2>사용자 관리</h2>
            <SearchBarHolder onSubmit={submit} ref={form}>
                <SearchBarInputHolder>
                    <SearchBar data-sug="true" autoComplete="off" type="text" name="q" defaultValue={props.search} placeholder="이메일 또는 아이디"></SearchBar>
                </SearchBarInputHolder>
                <SearchBtn type="submit"><IoSearch /></SearchBtn>
            </SearchBarHolder>
            <DisplayH>
                {users.map((elem) => {
                    return (
                        <User key={elem.id}>
                            <span className="user">
                                <Link href={"/contribution/id/" + elem.id}>
                                    {elem.id}
                                </Link>
                            </span>
                            <label title={elem.email} className="email">
                                {elem.email}
                            </label>
                            <InputCheckBox
                                deletePermission={elem.deletePermission}
                                createPermission={elem.createPermission}
                                editPermission={elem.editPermission}
                                isAdmin={elem.isAdmin}
                                user={elem.id} />
                        </User>
                    )
                })}
            </DisplayH>
            <Btns>
                <Link style={{ textDecoration: "none" }} href={backward ? "?search="+(d.get("search")??"")+"&until=" + users[0].id : ""}><NavigationBtn disabled={!backward}><MdNavigateBefore />이전 페이지</NavigationBtn></Link>
                <Link style={{ textDecoration: "none" }} href={forward ? "?search="+(d.get("search")??"") +"&from="+ users.slice(-1)[0].id : ""}> <NavigationBtn disabled={!forward}>다음 페이지 <MdNavigateNext /></NavigationBtn></Link>
            </Btns>
        </Holder>
    )
}