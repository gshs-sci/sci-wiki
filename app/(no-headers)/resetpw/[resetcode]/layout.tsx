import { redirect } from 'next/navigation';

import { client } from "@/app/lib/redis";
export default async function Layout({
    params,
    children
}: {
    params: { resetcode: string };
    children: React.ReactNode;
}) {
    const email = await client.get("resetcode:"+params.resetcode)
    if(email==null) {
        return redirect("/")
    }
    return <>{children}</>
}