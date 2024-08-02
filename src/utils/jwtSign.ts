import { Response } from "express";
import jwt from "jsonwebtoken";

const jwtSign = (userId: string, res: Response) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });

  return token;
};

export default jwtSign;
