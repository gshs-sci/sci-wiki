"use server"
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import prisma from "@/app/lib/prisma";

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
    let createPerm=false
    if(!user){
        redirect("/")
    }
    const {createPermission} = await prisma.user.findFirst({
        where:{
            id:user
        },
        select:{
            createPermission:true
        }
    })
    createPerm=createPermission
    if(!createPerm) {
        redirect("/")
    }
    return <>
        {children}
    </>
}
