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

const db = {
  users,
  posts,
  comments
};

export { db as default };
