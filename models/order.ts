import mongoose, { Schema, Document, Model } from "mongoose";

// Define an interface for the product in the order
interface IProduct {
  productId: string;
  quantity: number;
}

// Define an interface for the order document
interface IOrder extends Document {
  userId: string;
  products: IProduct[];
  amount: number;
  address: Record<string, any>; // You can replace `any` with more specific type if the address structure is known
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
  address: { type: Object, required: true }, // Consider more specific typing if possible
  status: { type: String, default: "pending" },
});

const Order: Model<IOrder> = mongoose.model<IOrder>("Order", orderSchema);

export default Order;
