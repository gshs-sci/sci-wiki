
import { MainPage } from ".";
import prisma from "../lib/prisma";

export default async function Page() {
  const [updatedDocs, Subjects] = await prisma.$transaction([
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
  return <MainPage subjects={Subjects} newUpdated={updatedDocs} />
}