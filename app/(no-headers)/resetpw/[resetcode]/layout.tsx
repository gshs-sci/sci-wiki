import { redirect } from 'next/navigation';
import { createClient } from 'redis';

export default async function Layout({
    params,
    children
}: {
    params: { resetcode: string };
    children: React.ReactNode;
}) {
    const client = await createClient({
        url: 'redis://redis:6379'
    })
        .on('error', err => console.log('Redis Client Error', err))
        .connect();
    const email = await client.get("resetcode:"+params.resetcode)
    if(email==null) {
        return redirect("/")
    }
    return <>{children}</>
}