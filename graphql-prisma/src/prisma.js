import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466',
  secret: 'thisismysupersecrettext'
});

export { prisma as default };

// const createPostForUser = async (authorId, data) => {
//   const userExists = await prisma.exists.User({ id: authorId });
//   if (!userExists) {
//     throw new Error('User not found');
//   }

//   const post = await prisma.mutation.createPost(
//     {
//       data: {
//         ...data,
//         author: {
//           connect: {
//             id: authorId
//           }
//         }
//       }
//     },
//     `{ author { id name email posts { id title published } } }`
//   );
//   return post.author;
// };

// // createPostForUser('ckfajoiz500c80712ytclsoli', {
// //   title: 'new post',
// //   body: '',
// //   published: false
// // })
// //   .then(user => {
// //     console.log(JSON.stringify(user, undefined, 2));
// //   })
// //   .catch(error => console.log(error.message));

// const updatePostForUser = async (postId, data) => {
//   const postExists = await prisma.exists.Post({ id: postId });

//   if (!postExists) {
//     throw Error('Post not found');
//   }

//   const post = await prisma.mutation.updatePost(
//     {
//       where: {
//         id: postId
//       },
//       data
//     },
//     `{ author { id name email posts { id title published } } }`
//   );
//   return post.author;
// };

// // updatePostForUser('123', {
// //   title: 'Amazing books to read'
// // })
// //   .then(data => console.log(JSON.stringify(data, undefined, 2)))
// //   .catch(error => console.log(error.message));
