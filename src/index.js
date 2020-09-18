import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';
import db from './db';

const resolvers = {
  Query: {
    users(parent, args, { db }, info) {
      if (!args.query) {
        return db.users;
      }
      return db.users.filter(user =>
        user.name.toLowerCase().includes(args.query.toLowerCase())
      );
    },
    posts(parent, args, { db }, info) {
      if (!args.query) {
        return db.posts;
      }
      return db.posts.filter(post => {
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
    createUser(parent, args, { db }, info) {
      const emailTaken = db.users.some(user => {
        return user.email === args.data.email;
      });
      if (emailTaken) {
        throw new Error('Email taken.');
      }
      const user = {
        id: uuidv4(),
        ...args.data
      };

      db.users.push(user);

      return user;
    },
    deleteUser(parent, args, { db }, info) {
      const userIndex = db.users.findIndex(user => user.id === args.id);

      if (userIndex === -1) {
        throw new Error('User not found');
      }

      const deletedUsers = db.users.splice(userIndex, 1);

      posts = db.posts.filter(post => {
        const match = post.author === args.id;
        if (match) {
          comments = db.comments.filter(comment => comment.post !== post.id);
        }
        return !match;
      });
      comments = db.comments.filter(comment => comment.author !== args.id);

      return deletedUsers[0];
    },
    createPost(parent, args, { db }, info) {
      const userExists = db.users.some(user => user.id === args.data.author);

      if (!userExists) {
        throw new Error('User not found');
      }

      const post = {
        id: uuidv4(),
        ...args.data
      };

      db.posts.push(post);

      return post;
    },
    deletePost(parent, args, { db }, info) {
      const postIndex = db.posts.findIndex(post => post.id === args.id);

      if (postIndex === -1) {
        throw new Error('Post not found.');
      }

      const deletedPosts = db.posts.splice(postIndex, 1);

      comments = db.comments.filter(comment => comment.post !== args.id);

      return deletedPosts[0];
    },
    createComment(parent, args, { db }, info) {
      const userExists = db.users.some(user => user.id === args.data.author);
      const post = db.posts.find(post => post.id === args.data.post);

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

      db.comments.push(comment);

      return comment;
    },
    deleteComment(parent, args, { db }, info) {
      const commentIndex = db.comments.findIndex(
        comment => comment.id === args.id
      );

      if (commentIndex === -1) {
        throw new Error('Comment not found');
      }

      const deletedComment = db.comments.splice(commentIndex, 1);

      return deletedComment[0];
    }
  },
  Post: {
    author(parent, args, { db }, info) {
      return db.users.find(user => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, { db }, info) {
      return db.comments.filter(comment => comment.post === parent.id);
    }
  },
  Comment: {
    author(parent, args, { db }, info) {
      return db.users.find(user => user.id === parent.author);
    },
    post(parent, args, { db }, info) {
      return db.posts.find(post => post.id === parent.post);
    }
  },
  User: {
    posts(parent, args, { db }, info) {
      return db.posts.filter(post => post.author === parent.id);
    },
    comments(parent, args, { db }, info) {
      return db.comments.filter(comment => comment.author === parent.id);
    }
  }
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: {
    db
  }
});

server.start(() => {
  console.log('The server is up!');
});
