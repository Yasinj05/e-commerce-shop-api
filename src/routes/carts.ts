import express, { Request, Response, Router } from "express";
import {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} from "./verifyToken";
import Cart from "../models/Cart";
import validate from "../validations/validate";
import cartSchema from "../validations/cartValidation";

const router: Router = express.Router();

interface RequestWithCart extends Request {
  user?: {
    id: string;
    isAdmin: boolean;
  };
  body: {
    products?: { productId: string; quantity: number }[];
    [key: string]: any;
  };
  params: {
    id?: string;
    userId?: string;
  };
}

// Helper function for sending error responses
function sendErrorResponse(
  res: Response,
  statusCode: number,
  message: string,
  err: unknown
) {
  const errorDetails =
    err instanceof Error ? err.message : "An unknown error occurred";
  console.error(message, err);
  res.status(statusCode).json({ message, details: errorDetails });
}

// CREATE Cart
router.post(
  "/",
  verifyToken,
  validate(cartSchema),
  async (req: RequestWithCart, res: Response) => {
    const newCart = new Cart(req.body);
    try {
      const savedCart = await newCart.save();
      res.status(201).json(savedCart);
    } catch (err) {
      sendErrorResponse(res, 500, "Error saving cart", err);
    }
  }
);

// UPDATE Cart
router.put(
  "/:id",
  verifyTokenAndAuthorization,
  validate(cartSchema),
  async (req: RequestWithCart, res: Response) => {
    try {
      const updatedCart = await Cart.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedCart);
    } catch (err) {
      sendErrorResponse(res, 500, "Error updating cart", err);
    }
  }
);

// DELETE Cart
router.delete(
  "/:id",
  verifyTokenAndAuthorization,
  async (req: RequestWithCart, res: Response) => {
    try {
      await Cart.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Cart has been deleted..." });
    } catch (err) {
      sendErrorResponse(res, 500, "Error deleting cart", err);
    }
  }
);

// FIND Cart by User ID
router.get(
  "/find/:userId",
  verifyTokenAndAuthorization,
  async (req: RequestWithCart, res: Response) => {
    try {
      const cart = await Cart.findOne({ userId: req.params.userId });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      res.status(200).json(cart);
    } catch (err) {
      sendErrorResponse(res, 500, "Error finding cart", err);
    }
  }
);

// GET ALL Carts
router.get(
  "/",
  verifyTokenAndAdmin,
  async (req: RequestWithCart, res: Response) => {
    try {
      const carts = await Cart.find();
      res.status(200).json(carts);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

export default router;
