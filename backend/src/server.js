import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRouter.js";
import orderRouter from "./routes/orderRouter.js";
import healthRouter from "./routes/healthRouter.js";
import productRouter from "./routes/productRoute.js";
import paymentRouter from "./routes/paymentRouter.js";
import discountRouter from "./routes/discountRouter.js";
import newsletterRouter from "./routes/newsletterRouter.js";

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/health", healthRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/discount", discountRouter);
app.use("/api/v1/newsletter", newsletterRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on: http://localhost:${PORT}`);
  });
});
