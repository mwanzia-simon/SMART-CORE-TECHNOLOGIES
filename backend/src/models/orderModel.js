import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    paymentMode: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      required: true,
    },
    userOrders: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
