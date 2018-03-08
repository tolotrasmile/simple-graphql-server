const fetch = require('node-fetch')
const { GraphQLList, GraphQLNonNull, GraphQLInt, GraphQLObjectType, GraphQLSchema, GraphQLString } = require('graphql')

const BASE_URL = 'https://jsonplaceholder.typicode.com'

const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    body: { type: GraphQLString }
  })
})

// User Type
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    posts: {
      type: new GraphQLList(PostType),
      args: {
        limit: { type: GraphQLInt }
      },
      resolve ({ id }, { limit }) {
        const url = `${BASE_URL}/users/${id}/posts`
        return fetch(url)
          .then(result => result.json())
          .then(result => result.slice(0, limit))
      }
    }
  })
})

const query = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve (parentValue, { id }) {
        return fetch(`${BASE_URL}/users/${id}`).then(result => result.json())
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve () {
        return fetch(`${BASE_URL}/users`).then(result => result.json())
      }
    }
  })
})

// Mutations
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve (parentValue, body) {
        return fetch(`${BASE_URL}/users`, { method: 'POST', body })
          .then(res => res.json())
          .then(json => json)
      }
    }
  })
})

module.exports = new GraphQLSchema({ query, mutation })
