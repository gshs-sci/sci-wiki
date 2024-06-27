import * as diff from 'diff'
import prisma from '@/app/lib/prisma';
import { redirect } from 'next/navigation';
import { Compare } from './compare';
export default async function Page({
    searchParams,
}: {
    searchParams?: { [key: string]: string | undefined };
}) {
    let before,after
    if(searchParams!.after && !searchParams!.before) {
        const data = await prisma.contribution.findFirst({
            where:{
                id:searchParams!.after
            },
            select:{
                before:true,
                after:true
            }
        })
        if(data!=null) {
            ({ before,after } = data)
        }else {
            redirect("/contribution")
        }
    }else if(searchParams!.after && searchParams!.before) {
        const [before_cont, after_cont] = await prisma.$transaction([
            prisma.contribution.findFirst({
                where:{
                    id:searchParams!.before
                },
                select:{
                    after:true
                }
            }),
            prisma.contribution.findFirst({
                where:{
                    id:searchParams!.after
                },
                select:{
                    after:true
                }
            })
        ])
        before = before_cont!.after
        after = after_cont!.after
    }else {
        redirect("/contribution")
    }
    return (
        <>
            <Compare compareObject={diff.diffLines(before,after)} beforeId={searchParams!.before?searchParams!.before:searchParams!.after} afterId={searchParams!.after}/>
        </>
    )
}