import { createClient } from 'redis';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function ValidatePageSSR() {
    const client = await createClient({
        url: 'redis://redis:6379'
    }).on('error', err => console.log('Redis Client Error', err))
        .connect();
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