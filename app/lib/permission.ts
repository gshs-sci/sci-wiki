"use server"
import prisma from "./prisma";
import * as config from "@/sci-config.json"

interface Config {
    allow_unauthorized_edit: boolean,
    allow_unauthorized_delete: boolean,
    allow_unauthorized_create: boolean,
    conditional_permission: Array<{
        condition: {
            email?: string,
            id?: string
        },
        permission: Array<"admin" | "delete" | "create" | "edit">
    }>
}

const typedConfig = config as Config

const conditionalPermission = (id: string, email: string): Array<"admin" | "delete" | "create" | "edit"> => {
    let permissions = new Set()

    typedConfig["conditional_permission"].forEach((data) => {
        const condition = data["condition"]
        let valid = false
        if ("email" in condition && condition["email"]) {
            valid = new RegExp(condition["email"]).test(email)
        }
        if ("id" in condition && condition["id"]) {
            valid = new RegExp(condition["id"]).test(id)
        }
        if (valid) {
            data["permission"].forEach((perm) => { permissions.add(perm) })
        }
    })
    return Array.from(permissions) as Array<"admin" | "delete" | "create" | "edit">
}

export const checkAdmin = async (userId: string | undefined | null) => {
    let isAdmin = false
    let id = ""
    let email = ""
    if (userId) {
        ({ isAdmin, id, email } = await prisma.user.findFirst({
            where: {
                id: userId
            },
            select: {
                isAdmin: true,
                id: true,
                email: true
            }
        }))
    }else {
        return false
    }
    if (conditionalPermission(id, email).includes("admin")) {
        return true
    }
    return isAdmin
}

export const checkDelete = async (userId: string | undefined | null) => {
    if (typedConfig["allow_unauthorized_delete"]) {
        return true
    }
    if (!userId) {
        return false
    }
    const { deletePermission, isAdmin, id, email } = await prisma.user.findFirst({
        where: {
            id: userId
        },
        select: {
            deletePermission: true,
            editPermission: true,
            createPermission: true,
            isAdmin: true,
            id: true,
            email: true
        }
    })
    if (isAdmin) {
        return true
    }
    if (deletePermission) {
        return true
    }
    const cond = conditionalPermission(id, email)
    if (cond.includes("admin") || cond.includes("delete")) {
        return true
    }
    return false
}

export const checkEdit = async (userId: string | undefined | null) => {
    if (typedConfig["allow_unauthorized_edit"]) {
        return true
    }
    if (!userId) {
        return false
    }
    const { editPermission, isAdmin, id, email } = await prisma.user.findFirst({
        where: {
            id: userId
        },
        select: {
            deletePermission: true,
            editPermission: true,
            createPermission: true,
            isAdmin: true,
            id: true,
            email: true
        }
    })
    if (isAdmin) {
        return true
    }
    if (editPermission) {
        return true
    }
    const cond = conditionalPermission(id, email)
    if (cond.includes("admin") || cond.includes("edit")) {
        return true
    }
    return false
}


export const checkCreate = async (userId: string | undefined | null) => {
    if (typedConfig["allow_unauthorized_create"]) {
        return true
    }
    if (!userId) {
        return false
    }
    const { createPermission, isAdmin, id, email } = await prisma.user.findFirst({
        where: {
            id: userId
        },
        select: {
            deletePermission: true,
            editPermission: true,
            createPermission: true,
            isAdmin: true,
            id: true,
            email: true
        }
    })
    if (isAdmin) {
        return true
    }
    if (createPermission) {
        return true
    }
    const cond = conditionalPermission(id, email)
    if (cond.includes("admin") || cond.includes("create")) {
        return true
    }
    return false
}
