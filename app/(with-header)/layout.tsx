
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { headers } from 'next/headers'
import { checkAdmin } from "../lib/permission";
const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let ip = headers().get("x-forwarded-for")
  let user = headers().get("x-user-id")
  const isAdmin = await checkAdmin(user)
  return (
    <>
        <Header userIp={ip!} userId={user!} isAdmin={isAdmin}></Header>
        {children}
        <Footer />
    </>
  );
}