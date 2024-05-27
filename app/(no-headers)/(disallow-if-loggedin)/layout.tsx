import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function disallowIfLoggedIn({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    if(headers().get("x-user-id")){
        redirect("/")
    }
    return <>
        {children}
    </>
}
