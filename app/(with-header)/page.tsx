
import { MainPage } from ".";
import prisma from "../lib/prisma";

export const metadata = {
  title: '메인페이지 - SCI'
}

export default async function Page() {
  const [pinnedDocs, updatedDocs, Subjects] = await prisma.$transaction([
    prisma.doc.findMany({
      orderBy: {
        lastUpdated: "desc"
    },
    where:{
      pinned:true
    },
    select:{
      subject:{
        select:{
          id:true
        }
      },
      title:true,
      lastUpdated:true,
      id:true
    },
    }),
    prisma.doc.findMany({
      orderBy: {
        lastUpdated: "desc"
    },
    select:{
      subject:{
        select:{
          id:true
        }
      },
      title:true,
      lastUpdated:true,
      id:true
    },
    take:10
    }),
    prisma.subject.findMany({
      select:{
        id:true
      }
    })
  ])
  return <MainPage subjects={Subjects} newUpdated={updatedDocs} pinned={pinnedDocs}/>
}