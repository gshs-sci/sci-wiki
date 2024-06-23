import Link from 'next/link'
import styles from "./not-found.module.css";
import { Playfair } from 'next/font/google';
const playfair = Playfair({ subsets: ["latin"] });

export const metadata = {
  title: 'SCI - 페이지를 찾을 수 없습니다'
}

export default function NotFound() {
  return (
    <div className={styles.holder}>
      <Link href="/" className={`${playfair.className} ${styles.logo}`}>
        SCI
      </Link>
      <h2>페이지를 찾을 수 없습니다</h2>
      <p>요청하신 리소스를 찾을 수 없습니다. 입력하신 주소가 정확한지 확인해 주세요</p>
      <Link href="/">홈으로 돌아가기</Link>
    </div>
  )
}