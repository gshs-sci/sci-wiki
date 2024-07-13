import { ConfigPage } from "./config"
import { ConfigClient } from "@/app/lib/permission"
import { Menu } from "./leftmenu"
export default async function Page() {
    const client = new ConfigClient()
    const config = await client.getCurrentConfig()
    return (
        <>
        <Menu activeKey="admin"/>
        <ConfigPage config={config}/>
        </>
    )
}