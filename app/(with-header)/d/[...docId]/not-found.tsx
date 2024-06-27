"use client"
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { josa } from 'es-hangul';

export default function Document() {
  const params = useParams<{ docId: Array<string>}>()
  const doc = decodeURIComponent(params.docId.join("/"))
  return (
    <div>
      <h2>문서: {decodeURIComponent(josa(doc,"이/가"))} 존재하지 않습니다</h2>
      <p>권한이 있다면, 문서를 직접 추가하실 수 있습니다</p>
      <Link href={`/edit?where=${encodeURIComponent(doc)}`}>[새 문서 만들기]</Link>
    </div>
  )
}