import styled from "styled-components"
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react"
import { FetchTags } from "./action"
import { RxCross2 } from "react-icons/rx";

const Holder = styled.div`
    display: flex;
    margin-bottom: 20px;
    align-items: center;
`
const CreateHolder = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`
const SelectTagHolder = styled.ul`
    top:16px;
    display: flex;
    flex-direction: column;
    position: absolute;
    padding: 5px;
    background-color: var(--color-background);
    border: solid 1px var(--color-border-primary);
    z-index: 10;
    margin-top: 10px;
    border-radius: 3px;
    list-style-type: none;
    & span {
        font-size: 11px;
        color: var(--color-font-secondary);
    }
`
const SelectTag = styled.li`
    font-size: 12px;
    user-select: none;
    cursor: pointer;
    padding: 2px 4px;
    &:hover {
        background-color: var(--color-background-hover);
    }
`
const TagHolder = styled.ul`
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
    position: relative;
    padding-left: 10px;
    white-space: nowrap;

`
const Tag = styled.li`
    background-color: var(--color-background);
    border: solid 1px var(--color-border-primary);
    padding: 1px 7px;
    padding-right: 25px;
    right: 10px;
    font-size: 12px;
    border-radius: 20px;
    margin-right: 10px;
    position: relative;
    display: flex;
    align-items: center;
    & span {
        border-radius: 20px;
        width: 13px;
        height: 13px;
        font-size: 10px;
        line-height: 10px;
        position: absolute;
        background-color: var(--color-border-primary);
        right: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-background);
        cursor: pointer;
    }
`
const NewTag = styled.input`
    background-color: var(--color-background);
    border: none;
    padding-right: 1.5em;
    right: 10px;
    font-size: 12px;
    border-radius: 3px;
    margin-right: 10px;
    margin: 0;
    padding: 7px 5px;
    color: var(--color-font-primary);
    &:focus {
        outline: none;
    }
`
export const Tags = (props: { default?: Array<string>, name: string }) => {
    const [tags, setTags] = useState<Array<string>>([])
    const [currentTags, setCurrentTags] = useState<Array<string>>([])
    const [isShown, setShown] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const listner = (e: Event) => {
        if (!(e.target as HTMLTextAreaElement).matches("[data-tag=true], [data-tag=true] *")) {
            setShown(false)
        }
    }
    useEffect(() => {
        if (props.default) setCurrentTags(props.default)
        addEventListener("click", listner)
        return () => {
            removeEventListener("click", listner)
        }
    }, [])

    useEffect(() => {
        inputRef.current!.value = ""
    }, [currentTags])

    const keyDown = (e: KeyboardEvent) => {
        if (e.nativeEvent.isComposing) return
        if (e.key == "Enter") {
            e.preventDefault()
            if(currentTags.indexOf(inputRef.current!.value)==-1)
                setCurrentTags(prevState => [...prevState, inputRef.current!.value])
        }
    }

    const Changed = async (e: ChangeEvent) => {
        const input = inputRef.current!.value

        if (input.length > 1) {
            setShown(true)
            const res = await FetchTags(inputRef.current!.value)
            setTags(res)
        } else {
            setShown(false)
        }
    }
    return (
        <Holder>
            {currentTags.map(elem =>
                <input type="hidden" name={props.name} value={elem} key={elem} />
            )}
            <TagHolder>
                {currentTags.map(elem =>
                    <Tag key={elem}>{elem}
                        <span onClick={() => setCurrentTags(prevState => prevState.filter(e => e != elem))}><RxCross2 /></span>
                    </Tag>
                )}
            </TagHolder>

            <CreateHolder data-tag={true}>
                <NewTag ref={inputRef} type="text" placeholder="+ 상세 분류 추가" onChange={Changed} onKeyDown={keyDown} onClick={()=>setShown(true)}/>
                {isShown ?
                    <SelectTagHolder>
                        {tags.length==0?
                        <span>
                            검색 결과가 없습니다
                        </span>
                        :<></>}
                        {tags.map(elem =>
                            <SelectTag onClick={() => {if(currentTags.indexOf(elem)==-1) setCurrentTags(prevState => [...prevState, elem])}} key={elem}>{elem}</SelectTag>
                        )}
                    </SelectTagHolder> : <></>}
            </CreateHolder>
        </Holder>
    )
}