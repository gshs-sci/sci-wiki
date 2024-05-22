
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { headers } from 'next/headers'
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let ip = headers().get("x-forwarded-for")
  return (
    <>
        <Header userIp={ip!}></Header>
        {children}
        <Footer />
    </>
  );
}
