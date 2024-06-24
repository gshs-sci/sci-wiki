"use server"
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import prisma from "@/app/lib/prisma";
import { checkCreate } from "@/app/lib/permission";
export async function generateMetadata({ params }: any) {
    return {
        title: "문서 작성 - SCI"
    }
}

export default async function checkCreatePerm({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    let user = headers().get("x-user-id")
    
    let createPerm=await checkCreate(user)
    if(!createPerm) {
        redirect("/")
    }
    return <>
        {children}
    </>
}
