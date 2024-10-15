"use server"
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import prisma from "@/app/lib/prisma";
import { checkCreate,checkAdmin } from "@/app/lib/permission";
import { Document } from "./createArea";
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
    
    let createPerm = await checkCreate(user)
    let isAdmin = await checkAdmin(user)
    if(!createPerm) {
        redirect("/")
    }
    return <>
        <Document isAdmin={isAdmin}/>
    </>
}
