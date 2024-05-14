
const prisma1 = require('@prisma/client')
const prisma = new prisma1.PrismaClient({})

// A `main` function so that you can use async/await
async function main() {
  // Create user, posts, and categories
  let d = ["물리", "생명", "지구과학", "정보과학", "수학"]
  for (const label of d) {
    await prisma.subject.upsert({
      where: { id: label },
      update: { id: label },
      create: { id: label }
    })
  }
  const userData = {
    id: "testUser123",
    email: "gs22048@gs.hs.kr",
  }
  await prisma.user.upsert({
    where: { id: "testUser123" },
    update: { ...userData },
    create: { ...userData }
  })
  const createData = {
    author: {
      connect: { id: "testUser123" }
    },
    doc: {
      create: {
        id: "test-document",
        title: "test document",
        content: "aa",
        subject: {
          connect: { id: "지구과학" }
        },
        tags: {
          create: {
            label: "test label",
          }
        }
      }
    },
    ip: "192.168.0.1"
  };

  await prisma.contribution.upsert({
    where: { id: 0 },

    create: { ...createData },
    update: { ...createData }
  });
}

main()

//note: Prisma will create the Contribution record, associate it with the User and Doc records, and automatically establish the relationship between the Doc and Contribution records through the doc field in the Contribution model.