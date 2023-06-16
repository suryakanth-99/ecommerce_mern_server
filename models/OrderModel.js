import mongoose from "mongoose";
var enu = {
  values: ["Not processing", "Processing", "Shipped", "Delivered", "Cancel"],
  message: "{VALUE} is not supported",
};
const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: "Products",
      },
    ],
    payment: {},
    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    OrderStatus: {
      type: String,
      enum: enu,
      default: "Processing",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
