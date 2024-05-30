import express, { Request, Response, Router } from "express";
import {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} from "./verifyToken";
import Product, { IProduct } from "../models/Product";
import validate from "../validations/validate";
import productSchema from "../validations/productValidation";

const router: Router = express.Router();

interface RequestWithProduct extends Request {
  user?: {
    id: string;
    isAdmin: boolean;
  };
  body: {
    name?: string;
    price?: number;
    description?: string;
    categories?: string[];
    [key: string]: any;
  };
  query: {
    new?: string;
    category?: string;
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

// CREATE Product
router.post(
  "/",
  verifyTokenAndAdmin,
  validate(productSchema),
  async (req: RequestWithProduct, res: Response) => {
    const newProduct = new Product(req.body);
    try {
      const savedProduct = await newProduct.save();
      res.status(201).json(savedProduct);
    } catch (err) {
      sendErrorResponse(res, 500, "Error saving product", err);
    }
  }
);

// UPDATE Product
router.put(
  "/:id",
  verifyTokenAndAdmin,
  validate(productSchema),
  async (req: RequestWithProduct, res: Response) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedProduct);
    } catch (err) {
      sendErrorResponse(res, 500, "Error updating product", err);
    }
  }
);

// DELETE Product
router.delete(
  "/:id",
  verifyTokenAndAuthorization,
  async (req: RequestWithProduct, res: Response) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Product has been deleted..." });
    } catch (err) {
      sendErrorResponse(res, 500, "Error deleting product", err);
    }
  }
);

// FIND Product by ID
router.get("/find/:id", async (req: RequestWithProduct, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    sendErrorResponse(res, 500, "Error finding product", err);
  }
});

//GET ALL PRODUCTS
router.get("/", async (req: RequestWithProduct, res: Response) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;

    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (err) {
    sendErrorResponse(res, 500, "Error retrieving products", err);
  }
});

export default router;
