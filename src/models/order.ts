import mongoose, { Schema, Document, Model } from "mongoose";

interface IProduct {
  productId: string;
  quantity: number;
}

export interface IOrder extends Document {
  userId: string;
  products: IProduct[];
  amount: number;
  address: Record<string, any>;
  status: string;
}

const orderSchema: Schema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  products: [
    {
      productId: {
        type: String,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, default: "pending" },
});

const Order: Model<IOrder> = mongoose.model<IOrder>("Order", orderSchema);

export default Order;
