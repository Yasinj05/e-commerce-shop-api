import express, { Request, Response, Router } from "express";
import Stripe from "stripe";

// Initialize Stripe with your secret key from the environment variables
const stripe = new Stripe(process.env.STRIPE_KEY as string);

const router: Router = express.Router();

interface PaymentRequest extends Request {
  body: {
    tokenId: string;
    amount: number;
  };
}

router.post("/payment", async (req: PaymentRequest, res: Response) => {
  try {
    const charge = await stripe.charges.create({
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd",
    });
    res.status(200).json(charge);
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
