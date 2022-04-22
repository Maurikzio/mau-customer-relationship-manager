const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });

const createToken = (usr, sw, expiresIn) => {
  const { id, /*email, name,*/ lastName} = usr;
  return jwt.sign({ id }, sw, { expiresIn });
}

// Resolvers
const resolvers = {
  Query: {
    getUser: async (_, { token }) => {
       const userId = await jwt.verify(token, process.env.SECRET_WORD);
       return userId; 
    }
  },
  Mutation: {
    newUser: async (_, { input }) => {
      const { email, password } = input;

      //checking if user is not registered
      const userAlreadyExists = await User.findOne({ email });
      if(userAlreadyExists) {
        throw new Error("User already exists!");
      }

      //hash pwd    
      //overriding the password in the input
      input.password = await bcryptjs.hashSync(password, 10);

      //save in DB
      try {
        const newUser = new User(input);
        newUser.save();
        // we need to return the new user created from the DB, same return of newUser mutation, *without the pwd
        return newUser; 
      } catch (err) {
        console.error(err);
      }
    },
    authenticateUser: async (_, { input }) => {
      const { email, password } = input;

      // does user exists
      const existingUser = await User.findOne({ email });
      if(!existingUser) {
        throw new Error("User does not exist!");
      }

      //check if pwd is correct
      const correctPwd = await bcryptjs.compareSync(password, existingUser.password)
      if(!correctPwd) {
        throw new Error("Incorrect pasword!");
      }

      //create token
      return {
        token: createToken(existingUser, process.env.SECRET_WORD, "24h")
      }

    }
  }
};

module.exports = resolvers;