import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface UserPayload {
  id: string;
  isAdmin: boolean;
}

interface RequestWithUser extends Request {
  user?: UserPayload;
}

export const verifyToken = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.token as string | undefined;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SEC!, (err, decoded) => {
      if (err) {
        return res.status(403).send("Token is not valid!");
      } else {
        req.user = decoded as UserPayload;
        next();
      }
    });
  } else {
    res.status(401).send("You are not authenticated!");
  }
};

export const verifyTokenAndAuthorization = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): void => {
  verifyToken(req, res, () => {
    if (req.user && (req.user.id === req.params.id || req.user.isAdmin)) {
      next();
    } else {
      res.status(403).json("You are not allowed to do that!");
    }
  });
};
