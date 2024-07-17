"use server"
import prisma from "@/app/lib/prisma"
import { headers } from "next/headers"
import { checkAdmin } from "@/app/lib/permission"

export const SetUserPermission = async (permission: "create" | "delete" | "edit" | "admin", value: boolean, id: string) => {
    let uid = headers().get("x-user-id")
    if (!await checkAdmin(uid)) {
        return { success: false }
    }
    try {
        let field: any
        switch (permission) {
            case "create":
                field = "createPermission"
                break
            case "delete":
                field = "deletePermission"
                break
            case "edit":
                field = "editPermission"
                break
            case "admin":
                field = "isAdmin"
                break
        }
        const res = await prisma.user.update({
            where: {
                id: id
            },
            data: {
                [field]:value
            },
            select:{
                [field]:true
            }
        })
        return { success:true, checked: Object.values(res)[0] }
    } catch (e) {
        return { success: false }
    }

}

export const DeleteUser = async (id: string) => {
    let uid = headers().get("x-user-id")
    if (!await checkAdmin(uid)) {
        return { success: false }
    }
    try {
        await prisma.user.delete({
            where: {
                id: id
            }
        })
        return { success: true }
    }
    catch (e) {
        return { success: false }
    }
}