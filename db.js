
const prisma1 = require('@prisma/client')
const prisma = new prisma1.PrismaClient({})

// A `main` function so that you can use async/await

const test_doc_data_b4=`
## Introduction
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Turpis massa sed elementum tempus egestas. Et pharetra pharetra massa massa ultricies mi. Pharetra vel turpis nunc eget lorem dolor sed. Faucibus interdum posuere lorem ipsum dolor. Velit laoreet id donec ultrices tincidunt arcu non sodales neque. Faucibus nisl tincidunt eget nullam. Fermentum odio eu feugiat pretium. Tristique magna sit amet purus gravida quis blandit turpis. Mi bibendum neque egestas congue. Eu sem integer vitae justo eget magna. Eget nulla facilisi etiam dignissim diam quis enim lobortis scelerisque. Quis imperdiet massa tincidunt nunc pulvinar sapien et ligula. Varius vel pharetra vel turpis nunc eget lorem dolor sed. Augue interdum velit euismod in pellentesque massa placerat. Vitae purus faucibus ornare suspendisse sed nisi lacus. Semper risus in hendrerit gravida rutrum quisque non tellus. Amet mauris commodo quis imperdiet massa tincidunt. Ac ut consequat semper viverra nam libero justo laoreet sit. Porttitor rhoncus dolor purus non enim.
`
const test_doc_data=`
## Introduction
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Turpis massa sed elementum tempus egestas. Et pharetra pharetra massa massa ultricies mi. Pharetra vel turpis nunc eget lorem dolor sed. Faucibus interdum posuere lorem ipsum dolor. Velit laoreet id donec ultrices tincidunt arcu non sodales neque. Faucibus nisl tincidunt eget nullam. Fermentum odio eu feugiat pretium. Tristique magna sit amet purus gravida quis blandit turpis. Mi bibendum neque egestas congue. Eu sem integer vitae justo eget magna. Eget nulla facilisi etiam dignissim diam quis enim lobortis scelerisque. Quis imperdiet massa tincidunt nunc pulvinar sapien et ligula. Varius vel pharetra vel turpis nunc eget lorem dolor sed. Augue interdum velit euismod in pellentesque massa placerat. Vitae purus faucibus ornare suspendisse sed nisi lacus. Semper risus in hendrerit gravida rutrum quisque non tellus. Amet mauris commodo quis imperdiet massa tincidunt. Ac ut consequat semper viverra nam libero justo laoreet sit. Porttitor rhoncus dolor purus non enim.

## Details no.1
Commodo nulla facilisi nullam vehicula ipsum a. At lectus urna duis convallis convallis tellus id interdum velit. Bibendum ut tristique et egestas quis ipsum. Mauris a diam maecenas sed enim ut sem viverra aliquet. Dignissim enim sit amet venenatis urna cursus. Turpis in eu mi bibendum neque egestas congue. Quis vel eros donec ac odio tempor orci dapibus. Cras pulvinar mattis nunc sed blandit. Sit amet cursus sit amet dictum sit. Condimentum mattis pellentesque id nibh tortor id. Vulputate ut pharetra sit amet aliquam id diam. Arcu ac tortor dignissim convallis aenean et tortor at risus. Phasellus egestas tellus rutrum tellus pellentesque eu tincidunt.

### Details no.1.1
Sed nisi lacus sed viverra tellus in hac habitasse. Erat pellentesque adipiscing commodo elit at imperdiet dui accumsan. Eleifend donec pretium vulputate sapien nec sagittis aliquam. Sit amet consectetur adipiscing elit. Rhoncus aenean vel elit scelerisque mauris pellentesque pulvinar. Amet massa vitae tortor condimentum lacinia quis. Fames ac turpis egestas maecenas. At consectetur lorem donec massa. Ac tortor dignissim convallis aenean et tortor at risus viverra. Cras tincidunt lobortis feugiat vivamus at augue eget. A lacus vestibulum sed arcu non odio euismod lacinia at.

#### Details no.1.1.1
Tortor pretium viverra suspendisse potenti nullam. Morbi tincidunt ornare massa eget egestas. Arcu odio ut sem nulla pharetra diam sit amet. Varius morbi enim nunc faucibus a. Lectus nulla at volutpat diam ut venenatis tellus in metus. Purus ut faucibus pulvinar elementum integer enim neque volutpat. Placerat duis ultricies lacus sed turpis tincidunt id. At augue eget arcu dictum varius duis at consectetur lorem. Scelerisque felis imperdiet proin fermentum leo vel. Dui accumsan sit amet nulla. Id aliquet risus feugiat in ante metus. Tortor id aliquet lectus proin nibh nisl condimentum id venenatis.

## Details no 2
Blandit libero volutpat sed cras ornare arcu dui. Enim lobortis scelerisque fermentum dui faucibus in. Blandit cursus risus at ultrices mi tempus. Sit amet justo donec enim. Eu nisl nunc mi ipsum faucibus vitae aliquet nec ullamcorper. Sit amet purus gravida quis blandit turpis cursus. Tincidunt nunc pulvinar sapien et ligula. Aliquam vestibulum morbi blandit cursus risus. Purus viverra accumsan in nisl. Vitae et leo duis ut diam quam nulla. Eget nunc scelerisque viverra mauris in aliquam.

## Details no 3
Suspendisse ultrices gravida dictum fusce ut placerat orci nulla pellentesque. Vivamus at augue eget arcu dictum varius. Adipiscing commodo elit at imperdiet dui accumsan sit amet. Porttitor massa id neque aliquam vestibulum morbi blandit cursus risus. Aenean pharetra magna ac placerat vestibulum lectus mauris ultrices eros. Eget nullam non nisi est sit amet. Est ultricies integer quis auctor elit sed. Volutpat diam ut venenatis tellus in metus vulputate. Velit scelerisque in dictum non consectetur a erat. Neque vitae tempus quam pellentesque nec nam aliquam sem et. Gravida rutrum quisque non tellus. Pretium vulputate sapien nec sagittis aliquam malesuada. Ut placerat orci nulla pellentesque dignissim enim sit amet venenatis. Convallis tellus id interdum velit laoreet id donec ultrices tincidunt. Vel orci porta non pulvinar neque laoreet. Elementum pulvinar etiam non quam lacus suspendisse.

## Details no 4
Fusce ut placerat orci nulla pellentesque dignissim enim. Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu. In aliquam sem fringilla ut morbi. Placerat vestibulum lectus mauris ultrices eros in. Pulvinar sapien et ligula ullamcorper malesuada proin libero. Volutpat blandit aliquam etiam erat velit scelerisque in dictum. Tristique magna sit amet purus gravida quis blandit. Ultricies mi eget mauris pharetra et ultrices. Dolor sed viverra ipsum nunc aliquet bibendum enim facilisis. Nibh praesent tristique magna sit amet purus gravida quis. Arcu bibendum at varius vel pharetra vel turpis. Diam ut venenatis tellus in metus vulputate eu scelerisque. Risus at ultrices mi tempus imperdiet nulla malesuada pellentesque elit. Volutpat ac tincidunt vitae semper quis lectus. Accumsan sit amet nulla facilisi morbi tempus iaculis. Ultrices mi tempus imperdiet nulla malesuada pellentesque elit eget. Arcu odio ut sem nulla. Ac orci phasellus egestas tellus rutrum tellus pellentesque eu tincidunt. Risus nec feugiat in fermentum posuere urna nec tincidunt. Sagittis id consectetur purus ut faucibus pulvinar elementum.

## Details no 5
Faucibus interdum posuere lorem ipsum. Orci sagittis eu volutpat odio facilisis mauris sit. Cras sed felis eget velit aliquet sagittis id consectetur. Diam vel quam elementum pulvinar etiam non quam lacus. Id porta nibh venenatis cras sed felis eget velit aliquet. Odio tempor orci dapibus ultrices in iaculis nunc sed. Gravida rutrum quisque non tellus orci. Et magnis dis parturient montes nascetur ridiculus mus. Sapien eget mi proin sed. Fermentum leo vel orci porta non.

### Details no 5.1
Amet porttitor eget dolor morbi non arcu risus. Nibh venenatis cras sed felis eget. Cursus metus aliquam eleifend mi in nulla posuere. In est ante in nibh mauris. Id donec ultrices tincidunt arcu non sodales neque. Malesuada fames ac turpis egestas sed tempus urna et. Ipsum dolor sit amet consectetur. Vitae ultricies leo integer malesuada nunc. Tristique senectus et netus et malesuada fames ac. Morbi tempus iaculis urna id volutpat lacus. Tellus in metus vulputate eu scelerisque felis imperdiet.

### Details no 5.2
Felis bibendum ut tristique et egestas. Massa sed elementum tempus egestas sed sed risus pretium. Vel quam elementum pulvinar etiam non quam. Amet porttitor eget dolor morbi non arcu risus quis varius. At erat pellentesque adipiscing commodo elit at imperdiet dui accumsan. Ac placerat vestibulum lectus mauris ultrices eros in cursus. Ac placerat vestibulum lectus mauris ultrices eros in cursus. Ultricies integer quis auctor elit sed vulputate mi sit amet. Nam at lectus urna duis convallis convallis tellus. Aliquam ultrices sagittis orci a scelerisque purus semper eget. Ac turpis egestas integer eget aliquet nibh praesent tristique. Pellentesque habitant morbi tristique senectus. Eget nulla facilisi etiam dignissim.

### Details no 5.3
Sed nisi lacus sed viverra tellus in hac habitasse platea. Ipsum dolor sit amet consectetur. Morbi enim nunc faucibus a pellentesque sit amet porttitor. Velit sed ullamcorper morbi tincidunt ornare massa eget. Lectus mauris ultrices eros in cursus turpis massa tincidunt. Duis ultricies lacus sed turpis tincidunt id aliquet risus. Ipsum suspendisse ultrices gravida dictum fusce ut. Vestibulum lorem sed risus ultricies tristique nulla aliquet enim tortor. In metus vulputate eu scelerisque felis imperdiet. Sit amet cursus sit amet dictum sit amet justo. Et malesuada fames ac turpis egestas integer eget aliquet nibh. Eleifend quam adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus. Sodales neque sodales ut etiam sit. In cursus turpis massa tincidunt dui ut ornare lectus. Nec feugiat in fermentum posuere urna nec.

#### Details no 5.3.1
Ut tellus elementum sagittis vitae et leo duis. Augue ut lectus arcu bibendum at varius. Leo in vitae turpis massa sed elementum. Ipsum a arcu cursus vitae congue mauris rhoncus aenean. Elementum integer enim neque volutpat. Turpis egestas maecenas pharetra convallis posuere morbi leo urna. Integer vitae justo eget magna. Risus at ultrices mi tempus imperdiet nulla malesuada pellentesque elit. Nisi scelerisque eu ultrices vitae auctor eu augue ut. Curabitur gravida arcu ac tortor dignissim. Morbi leo urna molestie at. Praesent tristique magna sit amet purus gravida quis blandit. Sed sed risus pretium quam vulputate dignissim suspendisse. Cursus sit amet dictum sit amet justo. Enim ut sem viverra aliquet eget sit amet. At auctor urna nunc id cursus metus aliquam. Magna eget est lorem ipsum dolor. Magna eget est lorem ipsum dolor sit amet consectetur.

#### Details no 5.3.2
Dolor morbi non arcu risus quis varius quam quisque id. Eget nullam non nisi est sit amet facilisis magna. Suspendisse faucibus interdum posuere lorem. Varius vel pharetra vel turpis nunc eget lorem dolor. Amet porttitor eget dolor morbi non. Feugiat vivamus at augue eget arcu dictum varius duis at. Habitasse platea dictumst quisque sagittis purus sit amet volutpat consequat. Laoreet suspendisse interdum consectetur libero id faucibus nisl tincidunt eget. Neque sodales ut etiam sit amet nisl. Ipsum a arcu cursus vitae congue mauris rhoncus. Placerat in egestas erat imperdiet sed euismod. Eget aliquet nibh praesent tristique magna sit. Condimentum mattis pellentesque id nibh. Nisl purus in mollis nunc. Massa vitae tortor condimentum lacinia quis vel eros donec ac. Lorem ipsum dolor sit amet. Mattis molestie a iaculis at erat pellentesque adipiscing commodo elit. Massa sed elementum tempus egestas sed sed risus. Pharetra et ultrices neque ornare aenean euismod elementum.

### Details no 5.4
Faucibus turpis in eu mi bibendum neque egestas congue quisque. Aliquet bibendum enim facilisis gravida neque. In ante metus dictum at tempor commodo ullamcorper a lacus. Sed odio morbi quis commodo odio. Ut eu sem integer vitae justo eget magna. Amet dictum sit amet justo donec enim diam vulputate ut. Amet consectetur adipiscing elit ut aliquam purus sit amet luctus. Viverra orci sagittis eu volutpat odio facilisis. Dolor sit amet consectetur adipiscing elit pellentesque habitant. Augue interdum velit euismod in pellentesque massa placerat duis ultricies. Vestibulum rhoncus est pellentesque elit ullamcorper dignissim. Aliquam etiam erat velit scelerisque in. Aliquam malesuada bibendum arcu vitae elementum curabitur vitae. Nunc non blandit massa enim. Adipiscing diam donec adipiscing tristique risus nec feugiat in.

### Details no 5.5
Non diam phasellus vestibulum lorem sed risus ultricies tristique. Sed adipiscing diam donec adipiscing tristique risus nec. Duis convallis convallis tellus id interdum. Tincidunt tortor aliquam nulla facilisi cras. Aliquam sem fringilla ut morbi tincidunt augue interdum velit euismod. Bibendum neque egestas congue quisque egestas diam. Vitae et leo duis ut diam. Vitae et leo duis ut diam. A iaculis at erat pellentesque adipiscing commodo elit. Suspendisse potenti nullam ac tortor vitae purus faucibus ornare suspendisse. Est ullamcorper eget nulla facilisi etiam dignissim diam. Ut diam quam nulla porttitor massa. Aliquet lectus proin nibh nisl condimentum id venenatis. Pharetra diam sit amet nisl suscipit adipiscing. A diam sollicitudin tempor id eu nisl nunc mi. Pellentesque adipiscing commodo elit at imperdiet dui accumsan.

#### Details no 5.5.1
Fusce id velit ut tortor pretium. Massa enim nec dui nunc mattis enim ut tellus. At quis risus sed vulputate odio ut enim. A erat nam at lectus urna duis convallis convallis. Habitant morbi tristique senectus et. Nam libero justo laoreet sit amet. Arcu risus quis varius quam quisque id diam. In metus vulputate eu scelerisque felis imperdiet proin fermentum. Eget duis at tellus at urna condimentum mattis pellentesque. Blandit turpis cursus in hac habitasse. Auctor elit sed vulputate mi sit. Nisl tincidunt eget nullam non nisi est. Amet consectetur adipiscing elit duis tristique sollicitudin nibh sit. Id faucibus nisl tincidunt eget nullam non nisi est sit. Mauris pharetra et ultrices neque ornare aenean euismod elementum nisi. Vel quam elementum pulvinar etiam non quam lacus suspendisse faucibus. Non consectetur a erat nam at. Risus sed vulputate odio ut. Eget mauris pharetra et ultrices. Sit amet consectetur adipiscing elit duis.

#### Details no 5.5.2
Nunc sed blandit libero volutpat sed cras ornare arcu. Mi eget mauris pharetra et ultrices neque. Risus feugiat in ante metus. Cras fermentum odio eu feugiat pretium nibh ipsum. Tristique senectus et netus et malesuada fames. Quis eleifend quam adipiscing vitae proin sagittis nisl. Tincidunt lobortis feugiat vivamus at augue eget arcu dictum. In ante metus dictum at tempor commodo ullamcorper a lacus. Consequat semper viverra nam libero justo laoreet sit amet. Adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus urna neque. Sit amet porttitor eget dolor morbi. Mattis pellentesque id nibh tortor id aliquet lectus proin nibh. Ultrices dui sapien eget mi proin. Imperdiet dui accumsan sit amet nulla. Curabitur gravida arcu ac tortor dignissim convallis aenean et. Molestie ac feugiat sed lectus. Diam vulputate ut pharetra sit amet. Nibh sit amet commodo nulla facilisi. Rutrum quisque non tellus orci ac auctor augue.

##### Details no 5.5.2.1
Sed felis eget velit aliquet sagittis id. Lobortis scelerisque fermentum dui faucibus in ornare quam viverra. Netus et malesuada fames ac turpis. Montes nascetur ridiculus mus mauris vitae ultricies leo integer. Sed sed risus pretium quam vulputate dignissim suspendisse. Cras adipiscing enim eu turpis egestas pretium aenean. Fames ac turpis egestas maecenas pharetra convallis posuere morbi leo. Malesuada pellentesque elit eget gravida cum sociis natoque. Egestas dui id ornare arcu odio ut sem nulla. Urna et pharetra pharetra massa massa ultricies mi. A diam maecenas sed enim ut sem. Ultricies mi quis hendrerit dolor magna eget. Eleifend quam adipiscing vitae proin sagittis nisl. Amet cursus sit amet dictum. Adipiscing enim eu turpis egestas pretium aenean pharetra. Nibh sed pulvinar proin gravida.

##### Details no 5.5.2.2
Vitae aliquet nec ullamcorper sit amet risus nullam eget. Sit amet est placerat in egestas erat imperdiet. At in tellus integer feugiat scelerisque varius. Sit amet est placerat in egestas erat. Commodo sed egestas egestas fringilla phasellus faucibus scelerisque. Amet commodo nulla facilisi nullam. Libero justo laoreet sit amet cursus sit amet dictum sit. Et netus et malesuada fames ac turpis egestas. Pellentesque eu tincidunt tortor aliquam nulla. Turpis egestas maecenas pharetra convallis posuere morbi leo urna. Urna id volutpat lacus laoreet. Augue neque gravida in fermentum et sollicitudin. Egestas sed tempus urna et pharetra pharetra massa. Sapien eget mi proin sed libero. Lectus urna duis convallis convallis tellus id interdum velit. Arcu vitae elementum curabitur vitae nunc sed velit dignissim sodales. Integer quis auctor elit sed vulputate mi sit.

## Conclusion
Tristique risus nec feugiat in fermentum posuere urna nec tincidunt. Placerat duis ultricies lacus sed turpis tincidunt id aliquet risus. Magna sit amet purus gravida quis blandit turpis cursus. Fames ac turpis egestas integer eget aliquet nibh praesent. Integer enim neque volutpat ac. Accumsan tortor posuere ac ut consequat semper viverra. Risus in hendrerit gravida rutrum quisque non tellus orci. Massa tincidunt nunc pulvinar sapien et ligula ullamcorper. Commodo elit at imperdiet dui. Tristique magna sit amet purus gravida. Nisi quis eleifend quam adipiscing vitae. Lacus vel facilisis volutpat est velit egestas dui id. At tempor commodo ullamcorper a lacus vestibulum sed arcu. Egestas egestas fringilla phasellus faucibus. Vitae semper quis lectus nulla at volutpat diam. Consectetur lorem donec massa sapien faucibus et molestie. Risus sed vulputate odio ut enim blandit.
`
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
    password:"47d69ccfc23bce9ecb96550abb36a9aa9ee5892f7f9fbbdec0ea10f55bacd0fc",
    deletePermission:true,
    createPermission:true
  }
  await prisma.user.upsert({
    where: { id: "testUser123" },
    update: { ...userData },
    create: { ...userData }
  })
  const createData = {
    before:test_doc_data_b4,
    after:test_doc_data,
    author: {
      connect: { id: "testUser123" }
    },
    doc: {
      create: {
        id: "test-document",
        title: "test document",
        content: test_doc_data,
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
    where: { id: 1 },

    create: { ...createData },
    update: { ...createData }
  });
}

main()

//note: Prisma will create the Contribution record, associate it with the User and Doc records, and automatically establish the relationship between the Doc and Contribution records through the doc field in the Contribution model.