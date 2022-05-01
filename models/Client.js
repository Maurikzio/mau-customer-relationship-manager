 const mongoose = require('mongoose');

 //will be created by User
 //the orders will be added by User(seller)

 const ClientSchema = mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true, 
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "User"
    }

 });

 module.exports = mongoose.model("Client", ClientSchema);