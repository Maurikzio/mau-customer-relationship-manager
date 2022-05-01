const User = require("../models/User");
const Product = require("../models/Product"); 
const Client = require("../models/Client");
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
    },
    getProducts: async () => {
      try {
        const products = await Product.find({});
        return products;
      } catch (err) {
        console.log(err);
      }
    },
    getProduct: async (_, { id }) => {
       //check if product exists
       const product = await Product.findById(id); 

       if(!product) {
         throw new Error("Product does not exist")
       }

       return product;
    },
    getClients: async () => {
      try {
        const clients = await Client.find({});
        return clients;
      } catch (err) {
        console.log(err);
      }
    },
    getUserClients: async (_, {}, ctx) => {
      try { 
        const clients = await Client.find({ seller: ctx.user.id.toString()});
        return clients;
      } catch (err) {
        console.log(err);
      }
    },
    getClient: async  (_, { id }, ctx) => {
      //check if client exists or not
      const client = await Client.findById(id);
      if(!client) {
        throw new Error("Client does not exist");
      }

      //only who created that client can see it otherwise he would steel the client
      if(client.seller.toString() !== ctx.user.id) {
        throw new Error("You are not allowed to see this user :(");
      }

      return client;

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

    },
    newProduct: async (_, { input }) => {
      try {
        const newProduct = new Product(input);

        //store in db
        const result = await newProduct.save();

        return result;
        
      } catch (err) {
        console.log(err);
      }
    },
    updateProduct: async (_, { id, input }) => {
      //check if products exits
      let product = await Product.findById(id); 

       if(!product) {
         throw new Error("Product does not exist");
       }

       //otherwise save in DB
       product = await Product.findOneAndUpdate({ _id: id }, input, { new: true }); // use { new: true } to return the very last update of the product

       return product;
    },
    deleteProduct: async (_, { id }) => {
      //check if product exists
      let product = await Product.findById(id); 

       if(!product) {
         throw new Error("Product does not exist");
       }

       //delete
       await Product.findOneAndDelete({ _id: id});
 
       return "Product deleted" // because we have Mutation: String.

    },
    newClient: async (_, { input }, ctx) => {
      //verify if client is registrated
      const { email } = input;
      const client = await Client.findOne({ email });

      if(client){
        throw new Error("Client already registered")
      }

      const newClient = new Client(input);
 
      //asign seller
      newClient.seller = ctx.user.id;

      //save into db
      try {
        const result = await newClient.save();
        return result;
      } catch(err) {
        console.log(err);
      }
    },
    updateClient: async (_, { id, input }, ctx) => {
      //check if exists or not
      let client = await Client.findById(id);

      if (!client) {
        throw new Error("Client does not exist");
      }
      //check if its User/Seller is the one that is updating
      if(client.seller.toString() !== ctx.user.id) {
        throw new Error("You are not allowed to see this user :(");
      }
      //save the Client
      client = await Client.findOneAndUpdate({ _id: id }, input, { new: true });
      return client;
    },
    deleteClient: async (_, { id}, ctx) => {
      let client = await Client.findById(id);

      if (!client) {
        throw new Error("Client does not exist");
      }

      if(client.seller.toString() !== ctx.user.id) {
        throw new Error("You are not allowed to perform this action");
      }

      await Client.findOneAndDelete({ _id: id });

      return "Client deleted"

    }
  }
};

module.exports = resolvers;