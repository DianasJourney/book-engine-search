const { AuthenticationError } = require('apollo-server-express')
const { User } = require('../models')
const { signToken } = require('../utils/auth')


const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select(
          '-__v -password'
        )
        return userData
      }
      throw new AuthenticationError('Please login')
    }
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email })
      //this will check the user for the email and password to see if it matches up
      if (!user) {
        throw new AuthenticationError('Cannot find user')
      }
      const correctPassword = await user.isCorrectPassword(password)

      // this checks the password
      if (!correctPassword) {
        throw new AuthenticationError('Incorrect password')
      }
//returns the token the user is found
      const token = signToken(user)
      return { token, user }
    },
    addUser: async (parent, args) => {
      const user = await User.create(args)
      const token = signToken(user)

      return { token, user }
    },
    saveBook: async (parent, { input }, context) => {
      if (context.user) {
        //finds the user and updates their book
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: input } },
          { new: true, runValidators: true }
        )
        return updatedUser
      }
      throw new AuthenticationError('You need to be logged in!')
    },
    //removes the book by finding the bookid 
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true }
        )
        return updatedUser
      }
      throw new AuthenticationError('You need to be logged in!')
    }
  }
}

module.exports = resolvers;
