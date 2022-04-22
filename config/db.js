const mongoose = require('mongoose');
require("dotenv").config({ path: ".env"})

const dbConnection = async () => {
  try {
      // await mongoose.connect(process.env.DB_MONGO, {
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
      //   useFindAndModify: false,
      //   useCreateIndex: true
      // });
      await mongoose.connect(process.env.DB_MONGO);
      console.log("DB connected :) ");
  } catch(err) {
    console.log("Smth wrong hapenned!");
    console.error(err);
    process.exit(1);
  }
};

module.exports = dbConnection;