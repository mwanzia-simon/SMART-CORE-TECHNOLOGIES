import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
  },
  savedAmount: {
    type: Number,
    required: true,
  },
  currentPrice: {
    type: Number,
    required: true,
  },
  specs: {
    type: Object,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

const Product = mongoose.model("Products", productSchema);
export default Product;
