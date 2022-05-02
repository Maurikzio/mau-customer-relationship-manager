const { ApolloServer } = require("apollo-server");
const typeDefs = require("./db/schema");
const resolvers = require("./db/resolvers");
const  dbConnection = require("./config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });

//connect to db
dbConnection();

//server, require al menos un type Query y un Resolver del mismo tipo
//we can pass the ctx disponible para todos los resolver, usefull for auth
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers["authorization"] || "";

    if(token) {
      try {
        const user = jwt.verify(token, process.env.SECRET_WORD);
        return {
          user
        }
      } catch (err) {
        console.log("Smth wrong happened");
        console.log(err);
      }
    }
  }
});

//run server
server.listen().then(({ url }) => {
  console.log(`Server ready on: ${url}`);
});

