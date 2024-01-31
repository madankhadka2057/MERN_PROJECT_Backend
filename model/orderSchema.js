const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    items: [
      {
        quantity: {
          type: Number,
          required: true,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    shoppingAddress: {
      type: String,
      required: true,
    },
    phoneNumber:{
      type:Number,
      require:true
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Delivered", "Cancelled", "Ontheway", "Preparation"],
      default: "Pending",
    },
    paymentDetails: {
      pidx:{type:String},
      method: {
        type: String,
        enum: ["COD", "Khalti"],
        default:"COD"
      },
      status: {
        type: String,
        enum: ["Success","Paid", "Failed", "Pending"],
        default: "Pending",
      },
    },
  },
  {
    timestamps: true,
  }
);
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
