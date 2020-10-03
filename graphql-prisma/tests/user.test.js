import 'cross-fetch/polyfill';
import prisma from '../src/prisma';
import seedDatabase, { userOne } from './utils/seedDatabase';
import getClient from './utils/getClient';
import { createUser, login, getUsers, getProfile } from './utils/operations';

const client = getClient();

beforeEach(seedDatabase);

it('Should create a new user', async () => {
  const variables = {
    data: {
      name: 'Sayaka',
      email: 'sayaka@example.com',
      password: '12345678'
    }
  };

  const response = await client.mutate({
    mutation: createUser,
    variables
  });
  const exists = await prisma.exists.User({
    id: response.data.createUser.user.id
  });

  expect(exists).toBe(true);
});

it('Should expose public author profiles', async () => {
  const response = await client.query({ query: getUsers });

  expect(response.data.users.length).toBe(2);
  expect(response.data.users[0].email).toBe(null);
  expect(response.data.users[0].name).toBe('Jen');
});

it('Should not login with bad credentials', async () => {
  const variables = {
    data: { email: 'jen@example.com', password: 'red12345' }
  };

  await expect(client.mutate({ mutation: login, variables })).rejects.toThrow();
});

it('Should not sign up user with invalid password', async () => {
  const variables = {
    data: { name: 'Madoka', email: 'madoka@example.com', password: 'short' }
  };

  await expect(
    client.mutate({ mutation: createUser, variables })
  ).rejects.toThrow();
});

it('Should fetch user profile', async () => {
  const client = getClient(userOne.jwt);
  const { data } = await client.query({ query: getProfile });

  expect(data.me.id).toBe(userOne.user.id);
  expect(data.me.name).toBe(userOne.user.name);
  expect(data.me.emails).toBe(userOne.user.emails);
});
