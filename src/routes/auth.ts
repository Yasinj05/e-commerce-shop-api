import { Router, Request, Response } from "express";
import _ from "lodash";
import User from "../models/User";
import userSchema from "../validations/userValidation";
import validate from "../validations/validate";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

// REGISTER
router.post(
  "/register",
  validate(userSchema),
  async (req: Request, res: Response) => {
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) return res.status(400).send("User already registered.");

      user = new User(_.pick(req.body, ["username", "email", "password"]));

      // Hash the password before saving to the database
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);

      await user.save();
      res
        .status(201)
        .send({ userId: user._id, username: user.username, email: user.email });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error registering new user", error: err });
    }
  }
);
// LOGIN
router.post(
  "/login",
  validate(userSchema),
  async (req: Request, res: Response) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) return res.status(400).send("Invalid email or password.");

      // Compare passwords
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword)
        return res.status(400).send("Invalid email or password.");

      const accessToken = jwt.sign(
        {
          id: user._id,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_SEC as string,
        { expiresIn: "3d" }
      );

      const userWithoutPassword = user.toObject();

      res.status(200).json({ ...userWithoutPassword, accessToken });
    } catch (err) {
      res.status(500).json({ message: "Error logging in", error: err });
    }
  }
);
export default router;
