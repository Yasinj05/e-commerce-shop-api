import mongoose, { Schema, Document, Model } from "mongoose";

interface IProduct {
  productId: string;
  quantity: number;
}

export interface ICart extends Document {
  userId: string;
  products: IProduct[];
}

const cartSchema: Schema = new mongoose.Schema({
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
});

const Cart: Model<ICart> = mongoose.model<ICart>("Cart", cartSchema);

export default Cart;
