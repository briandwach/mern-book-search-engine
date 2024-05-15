const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');

const secret = 'mysecret';
const expiration = '2h';

module.exports = {
  AuthenticationError: new GraphQLError('Could not authenticate user.', {
    extensions: {
      code: 'UNAUTHENTICATED',
    },
  }),
  signToken: function ({ email, password, _id }) {
    const payload = { email, password, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};