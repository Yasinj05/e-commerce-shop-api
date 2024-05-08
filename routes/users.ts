import express, { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import User, { IUser } from "../models/user";
import {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} from "./verifyToken";

const router: Router = express.Router();

interface RequestWithUser extends Request {
  user?: {
    id: string;
    isAdmin: boolean;
  };
  body: {
    password?: string;
    [key: string]: any;
  };
}

// Helper function for hashing password
async function hashPassword(password: string): Promise<string | null> {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (err) {
    console.error("Password hashing failed:", err);
    return null;
  }
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

// UPDATE User
router.put(
  "/:id",
  verifyTokenAndAuthorization,
  async (req: RequestWithUser, res: Response) => {
    if (req.body.password) {
      const hashedPassword = await hashPassword(req.body.password);
      if (!hashedPassword) {
        return sendErrorResponse(
          res,
          500,
          "Failed to hash password",
          new Error("Hashing failed")
        );
      }
      req.body.password = hashedPassword;
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      )
        .select("-password")
        .lean<IUser>();
      res.status(200).json(updatedUser);
    } catch (err) {
      sendErrorResponse(res, 500, "Error updating user", err);
    }
  }
);

// DELETE User
router.delete(
  "/:id",
  verifyTokenAndAuthorization,
  async (req: RequestWithUser, res: Response) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "User has been deleted..." });
    } catch (err) {
      sendErrorResponse(res, 500, "Error deleting user", err);
    }
  }
);

// FIND User by ID
router.get(
  "/find/:id",
  verifyTokenAndAdmin,
  async (req: RequestWithUser, res: Response) => {
    try {
      const user = await User.findById(req.params.id)
        .select("-password")
        .lean<IUser>();
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (err) {
      sendErrorResponse(res, 500, "Error finding user", err);
    }
  }
);

// GET ALL USERS
router.get(
  "/",
  verifyTokenAndAdmin,
  async (req: RequestWithUser, res: Response) => {
    const query = req.query.new as string;
    try {
      const users = query
        ? await User.find().sort({ _id: -1 }).limit(5).lean<IUser[]>()
        : await User.find().lean<IUser[]>();
      res.status(200).json(users);
    } catch (err) {
      sendErrorResponse(res, 500, "Error retrieving users", err);
    }
  }
);

export default router;
