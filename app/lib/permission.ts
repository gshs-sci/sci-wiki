import prisma from "./prisma";
import { client } from "@/app/lib/redis";
const defaultConfig = {
    "allow_unauthorized_edit": true,
    "allow_unauthorized_delete": false,
    "allow_unauthorized_create": false,
    "conditional_permission": [
        {
            "condition": {
                "email": "\\b[A-Za-z0-9._%+-]+@gs\\.hs\\.kr\\b"
            },
            "permission": ["delete", "create", "edit"]
        },
        {
            "condition": {
                "email": "^gs22048@gs.hs.kr$"
            },
            "permission": ["admin"]
        }
    ]
}

export interface Config {
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


const readConfig = async () => {
    let stored = await client.get("sci_configuration")
    let config
    if (!stored) {
        await client.set("sci_configuration", JSON.stringify(defaultConfig))
        config = defaultConfig as Config
    } else {
        config = JSON.parse(stored) as Config
    }
    return config
}

const conditionalPermission = async (id: string, email: string): Promise<Array<"admin" | "delete" | "create" | "edit">> => {
    let permissions = new Set()
    const typedConfig = await readConfig()
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
        let res = await prisma.user.findFirst({
            where: {
                id: userId
            },
            select: {
                isAdmin: true,
                id: true,
                email: true
            }
        })
        if (!res) {
            return false
        }
        ({ isAdmin, id, email } = res)
    } else {
        return false
    }
    if ((await conditionalPermission(id, email)).includes("admin")) {
        return true
    }
    return isAdmin
}

export const checkDelete = async (userId: string | undefined | null) => {
    const typedConfig = await readConfig()
    if (typedConfig["allow_unauthorized_delete"]) {
        return true
    }
    if (!userId) {
        return false
    }
    const res = await prisma.user.findFirst({
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
    if (!res) {
        return false
    }
    const { deletePermission, isAdmin, id, email } = res
    if (isAdmin) {
        return true
    }
    if (deletePermission) {
        return true
    }
    const cond = await conditionalPermission(id, email)
    if (cond.includes("admin") || cond.includes("delete")) {
        return true
    }
    return false
}

export const checkEdit = async (userId: string | undefined | null) => {
    const typedConfig = await readConfig()
    if (typedConfig["allow_unauthorized_edit"]) {
        return true
    }
    if (!userId) {
        return false
    }
    const res = await prisma.user.findFirst({
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
    if (!res) {
        return false
    }
    const { editPermission, isAdmin, id, email } = res
    if (isAdmin) {
        return true
    }
    if (editPermission) {
        return true
    }
    const cond = await conditionalPermission(id, email)
    if (cond.includes("admin") || cond.includes("edit")) {
        return true
    }
    return false
}


export const checkCreate = async (userId: string | undefined | null) => {
    const typedConfig = await readConfig()
    if (typedConfig["allow_unauthorized_create"]) {
        return true
    }
    if (!userId) {
        return false
    }
    const res = await prisma.user.findFirst({
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
    if (!res) return false
    const { createPermission, isAdmin, id, email } = res
    if (isAdmin) {
        return true
    }
    if (createPermission) {
        return true
    }
    const cond = await conditionalPermission(id, email)
    if (cond.includes("admin") || cond.includes("create")) {
        return true
    }
    return false
}

export class ConfigClient {
    async getCurrentConfig() {
        return await readConfig()
    }

    async writeToConfig(data: Config) {
        try {
            await client.set("sci_configuration", JSON.stringify(data))
            return true
        } catch (e) {
            return false
        }
    }

}