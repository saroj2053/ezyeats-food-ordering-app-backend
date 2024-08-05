import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

const protectedRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith("Bearer")) {
      token = authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in! Please login to continue",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY!
    ) as jwt.JwtPayload;

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "The user belonging to this token no longer exists.",
      });
    }

    req.userId = user._id.toString();

    next();
  } catch (error) {
    console.log("Error in protectedRoute middleware", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default protectedRoute;
