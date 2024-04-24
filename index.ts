import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/users";

const app: Express = express();

dotenv.config();

app.use(express.json());
app.use("/api/users", userRoute);

const PORT: string | number = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

mongoose
  .connect(process.env.MONGO_URL as string)
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err: any) => console.error(err));
