const Query = {
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
};
export { Query as default };
