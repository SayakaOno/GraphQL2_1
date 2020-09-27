import jwt from 'jsonwebtoken';

export default userId => {
  return jwt.sign({ userId }, 'thisisasecret', {
    expiresIn: '7 days'
  });
};
