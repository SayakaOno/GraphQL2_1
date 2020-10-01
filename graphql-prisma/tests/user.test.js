import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import prisma from '../src/prisma';
import seedDatabase, { userOne } from './utils/seedDatabase';
import getClient from './utils/getClient';

const client = getClient();

beforeEach(seedDatabase);

it('Should create a new user', async () => {
  const createUser = gql`
    mutation {
      createUser(
        data: {
          name: "Sayaka"
          email: "sayaka@example.com"
          password: "12345678"
        }
      ) {
        token
        user {
          id
        }
      }
    }
  `;

  const response = await client.mutate({
    mutation: createUser
  });
  const exists = await prisma.exists.User({
    id: response.data.createUser.user.id
  });

  expect(exists).toBe(true);
});

it('Should expose public author profiles', async () => {
  const getUsers = gql`
    query {
      users {
        id
        name
        email
      }
    }
  `;
  const response = await client.query({ query: getUsers });

  expect(response.data.users.length).toBe(1);
  expect(response.data.users[0].email).toBe(null);
  expect(response.data.users[0].name).toBe('Jen');
});

it('Should not login with bad credentials', async () => {
  const login = gql`
    mutation {
      login(data: { email: "jen@example.com", password: "red12345" }) {
        token
      }
    }
  `;

  await expect(client.mutate({ mutation: login })).rejects.toThrow();
});

it('Should not sign up user with invalid password', async () => {
  const createUser = gql`
    mutation {
      createUser(
        data: { name: "Madoka", email: "madoka@example.com", password: "short" }
      ) {
        token
      }
    }
  `;

  await expect(client.mutate({ mutation: createUser })).rejects.toThrow();
});

it('Should fetch user profile', async () => {
  const client = getClient(userOne.jwt);
  const getProfile = gql`
    query {
      me {
        id
        name
        email
      }
    }
  `;
  const { data } = await client.query({ query: getProfile });

  expect(data.me.id).toBe(userOne.user.id);
  expect(data.me.name).toBe(userOne.user.name);
  expect(data.me.emails).toBe(userOne.user.emails);
});
