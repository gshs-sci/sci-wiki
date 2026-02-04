import prisma from "@/app/lib/prisma"

export async function POST(req: Request) {
    try {
        const { query } = await req.json()
        if(query=="") {
            return Response.json([])
        }
        const res = await prisma.$queryRaw`
        SELECT title, id 
        FROM "Doc" 
        WHERE title_dis LIKE ${query + '%'} 
        ORDER BY title_dis ASC 
        LIMIT 10
        `;
        return Response.json(res)
    }catch(e){return Response.json([])}
  }


  const delay = () => { //For Latency Testing
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{resolve(null)},400)
    })
  }