const { ApolloServer } = require("apollo-server");
const typeDefs = require("./db/schema");
const resolvers = require("./db/resolvers");
const  dbConnection = require("./config/db");

//connect to db
dbConnection();

//server, require al menos un type Query y un Resolver del mismo tipo
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

//run server
server.listen().then(({ url }) => {
  console.log(`Server ready on: ${url}`);
});
