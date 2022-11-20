const express = require('express')
const path = require('path')
const db = require('./config/connection')

//requiring our apollo server aswell as schemas and utils
const { ApolloServer } = require('apollo-server-express')
const { typeDefs, resolvers } = require('./schemas')
const { authMiddleware } = require('./utils/auth')

const app = express()
const PORT = process.env.PORT || 3001

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
    cache: 'bounded'
  })
  await server.start()
  server.applyMiddleware({ app })
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`)
}

startServer()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//if in production then path the build and client into a static asset
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')))
}

//now listening on our local port
db.once('open', () => {
  app.listen(PORT, () => console.log(`Now listening on localhost:${PORT}`))
})
