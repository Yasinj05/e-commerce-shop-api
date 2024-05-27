import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/users";
import authRoute from "./routes/auth";
import productRoute from "./routes/products";
import orderRoute from "./routes/orders";
import cartRoute from "./routes/carts";
import stripeRoute from "./routes/stripe";

const app: Express = express();

dotenv.config();

app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);

const PORT: string | number = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

mongoose
  .connect(process.env.MONGO_URL as string)
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err: any) => console.error(err));
