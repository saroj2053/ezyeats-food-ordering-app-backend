import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import jwtSign from "../utils/jwtSign";

const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "Invalid body parameters" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords don't match" });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(200)
        .json({ message: "User already exists. Please login.." });
    }

    // generating avatar
    const avatarName = name.replace(" ", "+");
    const avatar = `https://ui-avatars.com/api/?name=${avatarName}&background=f97316&color=fff`;

    // hashing password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, avatar });
    await newUser.save();

    const token = jwtSign(newUser._id.toString(), res);

    const userDto = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.avatar,
      createdAt: newUser.createdAt,
    };

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: userDto,
      token: token,
    });
  } catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (req: Request, res: Response) => {
  // get the body parameters
  // check if user exists with the email id provided
  // compare password with the password in the db
  // on success, generate token, stored it in cookie and return the user credentials
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Invalid body parameters" });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // comparing passwords
    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwtSign(user._id.toString(), res);

    const userDto = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.createdAt,
    };

    res.status(201).json({
      success: true,
      message: "User logged in successfully",
      user: userDto,
      token: token,
    });
  } catch (error) {
    console.log("Error in login controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const logout = (req: Request, res: Response) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default { login, signup, logout };
