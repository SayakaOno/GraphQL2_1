import 'cross-fetch/polyfill';
import prisma from '../src/prisma';
import seedDatabase, {
  userOne,
  userTwo,
  commentOne
} from './utils/seedDatabase';
import { deleteComment } from './utils/operations';
import getClient from './utils/getClient';

beforeEach(seedDatabase);

it('Should delete own commnet', async () => {
  const client = getClient(userTwo.jwt);
  const variables = {
    id: commentOne.comment.id
  };

  await client.mutate({ mutation: deleteComment, variables });
  const exists = await prisma.exists.Comment({
    id: commentOne.comment.id
  });

  expect(exists).toBe(false);
});

it('Should not delete other users comment', async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    id: commentOne.comment.id
  };

  await expect(
    client.mutate({ mutation: deleteComment, variables })
  ).rejects.toThrow();
});
