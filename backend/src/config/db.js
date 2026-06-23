import mongoose from "mongoose";
import "dotenv/config";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODBURI);
    console.log("Mongodb connected succesifully!");
  } catch (error) {
    console.log("An error occured while connecting to mongodb", error);
  }
};
