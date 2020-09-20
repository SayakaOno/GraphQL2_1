import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466'
});

prisma.query
  .users(null, `{ id name posts { id title } }`)
  .then(data => console.log(JSON.stringify(data, undefined, 2)));

prisma.query
  .comments(null, `{ id text author { id name }}`)
  .then(data => console.log(JSON.stringify(data, undefined, 2)));

prisma.mutation
  .createPost(
    {
      data: {
        title: 'My plan in Japan',
        body: '',
        published: false,
        author: {
          connect: { id: 'ckfale18800sj07129x6wxkdq' }
        }
      }
    },
    `{ id title body published }`
  )
  .then(data => {
    console.log(data);
    prisma.query.users(null, `{ id name posts { id title }}`).then(data => {
      console.log(JSON.stringify(data, undefined, 2));
    });
  });

prisma.mutation
  .updatePost(
    {
      data: {
        body: 'I am going to...',
        published: true
      },
      where: {
        id: 'ckfbbun4u02bm0712uthjn069'
      }
    },
    `{ id title body published}`
  )
  .then(data => {
    console.log(JSON.stringify(data, undefined, 2));
    return prisma.query
      .posts(null, `{ title body author { name } }`)
      .then(data => {
        console.log(JSON.stringify(data, undefined, 2));
      });
  });
