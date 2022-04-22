const { gql } = require("apollo-server");

// Schema
const typeDefs = gql`

  type User {
    id: ID #not declared in the Schema but mongo will assign it.
    name: String
    lastName: String
    email: String
    #password: String, we are not returning password when creating a new one or authenticating one
    createdAt: String
  }

  type Token {
    token: String
  }

  input UserInput {
    name: String!
    lastName: String!
    email: String!
    password: String!
  }

  input AuthInput {
    email: String
    password: String
  }

  # Query is only for GET
  type Query {
    getUser(token: String!): User
  }

  type Mutation {
    newUser(input: UserInput): User  
    authenticateUser(input: AuthInput): Token
  }

`;

module.exports = typeDefs;

// #inputs, los creamos para que los resolvers tomen/acepten parametros/argumentos
// #inputs, pueden ir en Queries o en Resolvers 

// the QUERY or MUTATIONS created we have to replicate them in the resolvers.js