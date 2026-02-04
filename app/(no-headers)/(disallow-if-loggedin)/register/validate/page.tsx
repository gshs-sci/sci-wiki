import { createClient } from 'redis';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { client } from "@/app/lib/redis";

export default async function ValidatePageSSR() {
    const key = cookies().get("reg-key")
    if (!key) {
        redirect("/register")
    }
    let regData = await client.get(key.value)
    if (!regData) {
        redirect("/register")
    }
    return <>
        {JSON.parse(regData)["mail"]}
    </>
}