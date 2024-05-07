import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user";
import { verifyTokenAndAuthorization, verifyToken } from "./verifyToken";

const router = express.Router();

interface RequestWithUser extends Request {
  user?: any;
  body: {
    password?: string;
    [key: string]: any;
  };
}

// UPDATE
router.put(
  "/:id",
  verifyTokenAndAuthorization,
  async (req: RequestWithUser, res: Response) => {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;
      } catch (err) {
        return res
          .status(500)
          .json({ message: "Failed to hash password", error: err });
      }
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

export default router;
