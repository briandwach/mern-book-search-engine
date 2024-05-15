const { User } = require('../models');
const { methods } = require('../models/Book');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
     me: async (parent, { user = null, params }) => {
      return User.findOne({
        $or: [{ _id: user ? user._id : params.id }, { username: params.username }],
      });
    },
  },

  Mutation: {
    createUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw AuthenticationError
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError
      }

      const token = signToken(user);
      return { token, user };
    },

    saveBook: async (parent, { user, body }) => {
      return User.findOneAndUpdate(
        { _id: user._id },
        { $addToSet: { savedBooks: body } },
        { new: true, runValidators: true }
      );
    },
    deleteBook: async (parent, { user, params }) => {
      return User.findOneAndUpdate(
        { _id: user._id },
        { $pull: { savedBooks: { bookId: params.bookId } } },
        { new: true }
      );
    },
  },
};

module.exports = resolvers;