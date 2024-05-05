import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface RequestWithUser extends Request {
  user?: string | object; // Define the user property more specifically based on your usage
}

const verifyToken = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.token as string | undefined;

  if (authHeader) {
    const token = authHeader;
    jwt.verify(token, process.env.JWT_SEC!, (err, user) => {
      if (err) return res.status(403).send("Token is not valid!");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).send("You are not authenticated!");
  }
};

export default { verifyToken };
