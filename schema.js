const { GraphQLList, GraphQLNonNull, GraphQLInt, GraphQLObjectType, GraphQLSchema, GraphQLString } = require('graphql')

const customers = [
  { id: '1', name: 'John Doe 1', email: 'john1@doe.com', age: 1 },
  { id: '2', name: 'John Doe 2', email: 'john2@doe.com', age: 2 },
  { id: '3', name: 'John Doe 3', email: 'john3@doe.com', age: 3 },
  { id: '4', name: 'John Doe 4', email: 'john4@doe.com', age: 4 },
  { id: '5', name: 'John Doe 5', email: 'john5@doe.com', age: 5 },
  { id: '6', name: 'John Doe 6', email: 'john6@doe.com', age: 6 }
]

// Customer Type
const CustomerType = new GraphQLObjectType({
  name: 'Customer',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    age: { type: GraphQLInt }
  })
})

const query = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    customer: {
      type: CustomerType,
      args: {
        id: { type: GraphQLString }
      },
      resolve (parentValue, args) {
        return customers.filter(x => x.id === args.id)[0]
      }
    },
    customers: {
      type: new GraphQLList(CustomerType),
      resolve () {
        return customers
      }
    }
  })
})

// Mutations
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addCustomer: {
      type: CustomerType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve (parentValue, { name, email, age }) {
        console.log(customers.push({ name, email, age }))
      }
    }
  })
})

module.exports = new GraphQLSchema({ query, mutation })