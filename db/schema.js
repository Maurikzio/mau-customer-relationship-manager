const { gql } = require("apollo-server");

// Schema
const typeDefs = gql`
  #type -> what we can get from db
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

  type Product {
    id: ID
    name: String
    stock: Int
    price: Float
    createdAt: String
  }

  type Client {
    id: ID
    name: String
    lastName: String
    company: String
    email: String
    phone: String
    seller: ID
  }

  #input -> what we pass to the Mutations
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

  input ProductInput {
     name: String!
     stock: Int!
     price: Float! 
  }

  input ClientInput {
    name: String!
    lastName: String!
    company: String!
    email: String!
    phone: String
    # seller will be passed in the context(the actual logged in User)
  }

  # Query is only for GET
  type Query {
    getUser(token: String!): User

    getProducts: [Product]
    getProduct(id: ID!): Product

    getClients: [Client]
    getUserClients: [Client]
    getClient(id: ID!): Client
  }

  type Mutation { # edicion, creacion y eliminacion
    newUser(input: UserInput): User  
    authenticateUser(input: AuthInput): Token

    newProduct(input: ProductInput): Product
    updateProduct(id: ID!, input: ProductInput): Product
    deleteProduct(id: ID!): String

    newClient(input: ClientInput): Client
    updateClient(id: ID!, input: ClientInput): Client
    deleteClient(id: ID!): String

  }

`;

module.exports = typeDefs;

// #inputs, los creamos para que los resolvers tomen/acepten parametros/argumentos
// #inputs, pueden ir en Queries o en Resolvers 

// the QUERY or MUTATIONS created we have to replicate them in the resolvers.js