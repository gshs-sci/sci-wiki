
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { headers } from 'next/headers'

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let ip = headers().get("x-forwarded-for")
  let user = headers().get("x-user-id")
  return (
    <>
        <Header userIp={ip!} userId={user!}></Header>
        {children}
        <Footer />
    </>
  );
}
