import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

const users = [
  {
    id: '1',
    name: 'Sayaka',
    email: 'sayaka@test.com',
    age: 32
  },
  {
    id: '2',
    name: 'Madoka',
    email: 'madoka@test.com',
    age: 30
  },
  {
    id: '3',
    name: 'Yuto',
    email: 'yuto@test.com',
    age: 27
  }
];

const posts = [
  {
    id: '1',
    title: 'what is scrum',
    body: 'It is a methodology.',
    published: true,
    author: '1'
  },
  {
    id: '2',
    title: 'GraphQL',
    body: 'Do you know what GraphQL is?',
    published: true,
    author: '1'
  },
  {
    id: '3',
    title: 'Corona virus',
    body: 'I am working from home.',
    published: false,
    author: '2'
  }
];

const comments = [
  { id: '1', text: 'Fantastic!', author: '2', post: '1' },
  { id: '2', text: 'Awesome!', author: '2', post: '1' },
  { id: '3', text: 'Sounds good!', author: '3', post: '2' },
  { id: '4', text: 'That is brilliant!', author: '1', post: '3' }
];

const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments: [Comment!]!
    me: User!
    post: Post!
  }

  type Mutation {
    createUser(data: CreateUserInput!): User!
    createPost(data: CreatePostInput!): Post!
    createComment(data: CreateCommentInput!): Comment!
  }

  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }

  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  }

  input CreateCommentInput {
    text: String!
    author: ID!
    post: ID!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }
`;

const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }
      return users.filter(user =>
        user.name.toLowerCase().includes(args.query.toLowerCase())
      );
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }
      return posts.filter(post => {
        return (
          post.title.toLowerCase().includes(args.query.toLocaleLowerCase()) ||
          post.body.toLowerCase().includes(args.query.toLocaleLowerCase())
        );
      });
    },
    comments() {
      return comments;
    },
    me() {
      return {
        id: 'abc123',
        name: 'Sayaka',
        email: 'sayaka@example.com',
        age: 27
      };
    },
    post() {
      return {
        id: 'id1',
        title: 'post1',
        body: 'body1',
        published: true
      };
    }
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some(user => {
        return user.email === args.data.email;
      });
      if (emailTaken) {
        throw new Error('Email taken.');
      }
      const user = {
        id: uuidv4(),
        ...args.data
      };

      users.push(user);

      return user;
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some(user => user.id === args.data.author);

      if (!userExists) {
        throw new Error('User not found');
      }

      const post = {
        id: uuidv4(),
        ...args.data
      };

      posts.push(post);

      return post;
    },
    createComment(parent, args, ctx, info) {
      const userExists = users.some(user => user.id === args.data.author);
      const post = posts.find(post => post.id === args.data.post);

      if (!userExists) {
        throw Error('User does not exist.');
      }
      if (!post) {
        throw Error('Post does not exist');
      }
      if (!post.published) {
        throw Error('Post has not been published');
      }

      const comment = {
        id: uuidv4(),
        ...args.data
      };

      comments.push(comment);

      return comment;
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => comment.post === parent.id);
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find(user => user.id === parent.author);
    },
    post(parent, args, ctx, info) {
      return posts.find(post => post.id === parent.post);
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => post.author === parent.id);
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => comment.author === parent.id);
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log('The server is up!');
});
