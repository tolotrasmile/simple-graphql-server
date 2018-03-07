const express = require('express')
const schema = require('./schema')
const expressGraphQL = require('express-graphql')

const app = express()

app.use('/api', expressGraphQL({
  schema: schema,
  graphiql: true
}))

app.listen(4000, () => {
  console.log('Server is running on port 4000..')
})