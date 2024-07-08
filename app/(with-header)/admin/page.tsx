"use client"
import styled from "styled-components"
import { Banner } from "@/app/components/doc/component"
import { Menu } from "./leftmenu"
const Holder = styled.div`
    display: flex;
    flex-direction: column;
    & p {
        font-size: 15px;
        line-height: 24px;
    }
    & pre {
        font-size: 13px;
        line-height: 24px;
    }
`
export default function Page() {
    return (
        <>
            <Menu activeKey="admin" />
            <Holder>
                <Banner $normal={true}>관리자 콘솔에 오신 것을 환영합니다! 관리를 시작하기 전 아래 관리자 가이드를 정독해주세요</Banner>
                <h2>권한의 종류</h2>
                <p>권한은 크게 전역 권한, 조건부 권한과 사용자 권한의 3종류로 나누어집니다. 전역 권한은 모두에게 공통적으로 적용되는 권한이며, 사용자 권한은 특정한 사용자에게 별도로 부여할 수 있는 권한입니다. 편집, 삭제, 수정, 그리고 관리자 권한이 부여될 수 있습니다. 권한 확인 시에는 전역 권한&gt; 사용자 권한&gt; 조건부 권한 순으로 우선순위를 가집니다. 예를 들어, 전역 권한에서 특정 사용자에게 관리자 권한을 부여하지 않았어도, 사용자 권한에서 관리자 권한이 부여된다면 해당 사용자는 관리자가 됩니다. </p>
                <h3>전역 권한</h3>
                <p>전역 권한은 말 그대로, 모두에게 적용되는 권한입니다. 관리자 콘솔의 전역 설정 메뉴에서 변경할 수 있으며, <code>sci-config.json</code> 파일에서는 <code>allow_unauthorized_edit</code>, <code>allow_unauthorized_create</code>, <code>allow_unauthorized_delete</code> 키로 정의됩니다. 해당 값들은 모두 로그인이 되었는지의 여부에 관계없이 모든 사용자에게 어떠한 권한을 부여할지를 정의하며, 각각 문서의 편집, 수정, 삭제 권한을 의미합니다. 전역 권한의 기본값은 다음과 같습니다:</p>
                <pre>
                    <code>
                        {`{
    "allow_unauthorized_edit":true,
    "allow_unauthorized_delete":false,
    "allow_unauthorized_create":false
}`}
                    </code>
                </pre>
                <p>관리자 권한은 전역 권한으로 부여할 수 없습니다.</p>
                <h3>사용자 권한</h3>
                <p>사용자 권한은 특정 사용자에게 부여되는 권한입니다. 관리자 콘솔의 사용자 관리 메뉴에서 변경할 수 있습니다. 사용자 권한은 데이터베이스에 저장되기 때문에 <code>sci-config.json</code> 파일에서는 변경할 수 없습니다.</p>
                <h3>조건부 권한</h3>
                <p>조건부 권한은 사용자가 특정 조건을 만족할 때 부여되는 권한입니다. 사용자 권한은 사용자에 대해 각자 부여해야 하는 반면, 조건부 권한은 여러명에게 한번에 권한을 부여할 수 있으며, 이후 신규로 가입하는 사용자에 대해서도 자동으로 권한이 부여됩니다. 조건부 권한은 조건을 만족하는 특정 집단의 사용자들에게 한번에 권한을 부여하고 싶을 때에 사용하면 됩니다. 조건부 권한 또한 관리자 콘솔의 전역 설정에서 변경할 수 있으며, <code>sci-config.json</code> 파일에서는 <code>conditional_permission</code> 키로 정의됩니다. </p>

            </Holder>
        </>

    )
}