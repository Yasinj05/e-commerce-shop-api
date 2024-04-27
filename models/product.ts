import mongoose, { Schema, Document, Model } from "mongoose";

interface IProduct extends Document {
  title: string;
  desc: string;
  img: string;
  categories: string[];
  size?: string;
  color?: string;
  price: number;
}

const productSchema: Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    categories: { type: [String] },
    size: { type: String },
    color: { type: String },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Product: Model<IProduct> = mongoose.model<IProduct>(
  "Product",
  productSchema
);

export default Product;
