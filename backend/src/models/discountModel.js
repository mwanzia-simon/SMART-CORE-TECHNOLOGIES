import mongoose from "mongoose";

const discountSchema = mongoose.Schema(
  {
    discount: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  { timestamps: true },
);


const Discount = mongoose.model("Discount",discountSchema)
export default Discount
