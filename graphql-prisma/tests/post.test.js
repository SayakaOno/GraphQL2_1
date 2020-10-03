import 'cross-fetch/polyfill';
import prisma from '../src/prisma';
import seedDatabase, { userOne, postOne, postTwo } from './utils/seedDatabase';
import getClient from './utils/getClient';
import {
  getPosts,
  myPosts,
  updatePost,
  createPost,
  deletePost,
  subscribeToPosts
} from './utils/operations';

const client = getClient();

beforeEach(seedDatabase);

it('Should expose published posts', async () => {
  const response = await client.query({ query: getPosts });

  expect(response.data.posts.length).toBe(1);
  expect(response.data.posts[0].published).toBe(true);
});

it('Should fetch users posts', async () => {
  const client = getClient(userOne.jwt);

  const { data } = await client.query({ query: myPosts });
  expect(data.myPosts.length).toBe(2);
});

it('Should be able to update own post', async () => {
  const variables = {
    id: postOne.post.id,
    data: {
      published: false
    }
  };
  const client = getClient(userOne.jwt);

  const { data } = await client.mutate({ mutation: updatePost, variables });
  const exists = await prisma.exists.Post({
    id: postOne.post.id,
    published: false
  });

  expect(data.updatePost.published).toBe(false);
  expect(exists).toBe(true);
});

it('Should create a new post', async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    data: {
      title: 'third post',
      body: 'Testing creating post...',
      published: false
    }
  };

  const { data } = await client.mutate({ mutation: createPost, variables });
  const exists = await prisma.exists.Post({
    id: data.createPost.id
  });

  expect(data.createPost.title).toBe('third post');
  expect(exists).toBe(true);
});

it('Should delete post', async () => {
  const client = getClient(userOne.jwt);
  const variables = { id: postTwo.post.id };

  await client.mutate({ mutation: deletePost, variables });
  const exists = await prisma.exists.Post({ id: postTwo.post.id });

  expect(exists).toBe(false);
});

it('Should subscribe to changes for published post', async done => {
  client.subscribe({ query: subscribeToPosts }).subscribe({
    next(response) {
      expect(response.data.post.mutation).toBe('DELETED');
      done();
    }
  });
  await prisma.mutation.deletePost({
    where: { id: postOne.post.id }
  });
});
