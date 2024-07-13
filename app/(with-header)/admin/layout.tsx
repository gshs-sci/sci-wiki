import { checkAdmin } from "@/app/lib/permission";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Holder } from "./holder";

export default async function AdminPage({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    let user = headers().get("x-user-id")
    const isAdmin = await checkAdmin(user)
    if(!isAdmin) {
        return notFound()
    }
    return (
        <>
            <Holder>
            {children}
            </Holder>
        </>
    );
}
