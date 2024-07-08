"use server"
import { checkAdmin, Config, ConfigClient } from "@/app/lib/permission"
import { headers } from "next/headers";
function parseFormData(formData: FormData): any {
    const result: any = {
        edit: '',
        condition: []
    };

    formData.forEach((value, key) => {
        if (key === 'edit' || key === 'delete' || key === 'create') {
            result[key] = value as string;
        } else {
            const match = key.match(/condition\[(\d+)\]\['(\w+)'\](\[\d+\])?/);
            if (match) {
                const [, index, property, arrayIndex] = match;
                const conditionIndex = parseInt(index);

                if (!result.condition[conditionIndex]) {
                    result.condition[conditionIndex] = { property: '', regex: '', perm: [] };
                }

                if (property === 'perm') {
                    result.condition[conditionIndex].perm.push(value as string);
                } else {
                    result.condition[conditionIndex][property] = value as string;
                }
            }
        }
    });
    return result;
}

export const Apply = async (prevState: any, formData: FormData) => {
    let uid = headers().get("x-user-id")
    if(!await checkAdmin(uid)) {
        return { success: false }
    }
    const parsed = parseFormData(formData)

    const allowedit = parsed.edit ? true : false
    const allowdelete = parsed.delete ? true : false
    const allowcreate = parsed.create ? true : false
    const conditional = parsed.condition.map((elem: any) => {
        return {
            condition: {
                [elem.property]: elem.regex
            },
            permission: elem.perm
        }
    })
    try {
        const client = new ConfigClient()
        const data: Config = {
            allow_unauthorized_create: allowcreate,
            allow_unauthorized_delete: allowdelete,
            allow_unauthorized_edit: allowedit,
            conditional_permission: conditional
        }
        await client.writeToConfig(data)
        return { success: true, data: data }
    } catch (e) {
        return { success: false }
    }
}