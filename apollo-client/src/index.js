import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import ApolloBoost, { gql } from 'apollo-boost';

const client = new ApolloBoost({
  uri: 'http://localhost:4000'
});

const getUsers = gql`
  query {
    users {
      id
      name
    }
  }
`;

const getPosts = gql`
  query {
    posts {
      title
      author {
        name
      }
    }
  }
`;

const App = () => {
  const [userData, setUserData] = useState([]);
  const [postData, setPostData] = useState([]);
  useEffect(() => {
    client
      .query({
        query: getUsers
      })
      .then(response => {
        setUserData(response.data.users);
      });

    client
      .query({
        query: getPosts
      })
      .then(response => {
        setPostData(response.data.posts);
      });
  }, []);

  const renderUsers = () => {
    if (!userData.length) {
      return 'no data';
    }
    return userData.map(user => {
      return (
        <div key={user.name}>
          <h3>{user.name}</h3>
        </div>
      );
    });
  };

  const renderPosts = () => {
    if (!postData.length) {
      return 'no data';
    }
    return postData.map((post, index) => {
      return (
        <div key={index}>
          {post.title} ({post.author.name})
        </div>
      );
    });
  };

  return (
    <React.Fragment>
      {renderUsers()}
      {renderPosts()}
    </React.Fragment>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
