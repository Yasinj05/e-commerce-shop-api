import express, { Request, Response, Router } from "express";
import {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} from "./verifyToken";
import Order, { IOrder } from "../models/Order";
import validate from "../validations/validate";
import orderSchema from "../validations/orderValidation";

const router: Router = express.Router();

interface RequestWithOrder extends Request {
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

// CREATE Order
router.post(
  "/",
  verifyToken,
  validate(orderSchema),
  async (req: RequestWithOrder, res: Response) => {
    const newOrder = new Order(req.body);
    try {
      const savedOrder = await newOrder.save();
      res.status(201).json(savedOrder);
    } catch (err) {
      sendErrorResponse(res, 500, "Error saving order", err);
    }
  }
);

// UPDATE Order
router.put(
  "/:id",
  verifyTokenAndAdmin,
  validate(orderSchema),
  async (req: RequestWithOrder, res: Response) => {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedOrder);
    } catch (err) {
      sendErrorResponse(res, 500, "Error updating order", err);
    }
  }
);

// DELETE Order
router.delete(
  "/:id",
  verifyTokenAndAdmin,
  async (req: RequestWithOrder, res: Response) => {
    try {
      await Order.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Order has been deleted..." });
    } catch (err) {
      sendErrorResponse(res, 500, "Error deleting order", err);
    }
  }
);

// FIND Order by User ID
router.get(
  "/find/:userId",
  verifyTokenAndAuthorization,
  async (req: RequestWithOrder, res: Response) => {
    try {
      const orders = await Order.find({ userId: req.params.userId });
      if (!orders.length) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.status(200).json(orders);
    } catch (err) {
      sendErrorResponse(res, 500, "Error finding order", err);
    }
  }
);

// GET ALL Orders
router.get(
  "/",
  verifyTokenAndAdmin,
  async (req: RequestWithOrder, res: Response) => {
    try {
      const orders = await Order.find();
      res.status(200).json(orders);
    } catch (err) {
      sendErrorResponse(res, 500, "Error retrieving orders", err);
    }
  }
);

// GET MONTHLY income
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(lastMonth.setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    sendErrorResponse(res, 500, "Error calculating income", err);
  }
});

export default router;
