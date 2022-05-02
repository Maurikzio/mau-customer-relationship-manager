const mongoose = require("mongoose");

// joins CLients, Products and Users

const OrderSchema = mongoose.Schema({
  order: {
    type: Array,
    required: true,
  },
  total: {
    type: Number, 
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Client"
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "User"
  },
  status: {
    type: String,
    default: "pending" // pending, completed, cancelled
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  }
});

module.exports = mongoose.model("Order", OrderSchema);
