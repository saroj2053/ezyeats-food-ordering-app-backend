import { Request, Response } from "express";
import User from "../models/user";
import Address from "../models/address";

const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const user = await User.findById(userId).lean().populate("address");

    if (user) {
      //destructuring user to omit password field
      const { password, ...userWithoutPassword } = user;
      res
        .status(200)
        .json({ message: "User Details", user: userWithoutPassword });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log("Error in getUserProfile controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateUserProfile = async (req: Request, res: Response) => {
  // 1) to update the user name and details for shipping
  // 2) check if there is existing address if found update it
  // 3) otherwise create new one
  // 4) link addressId to user
  try {
    const userId = (req as any).user.id;
    const { name, addressLine1, city, country } = req.body;
    if (!name || !addressLine1 || !city || !country) {
      return res.status(400).json({ message: "Invalid body parameters" });
    }

    const userDetails = await User.findById(userId).lean().populate("address");

    let addressId;

    if (userDetails?.address) {
      // Updating the existing address
      await Address.findByIdAndUpdate(
        userDetails.address._id,
        { addressLine1, city, country },
        { new: true }
      );

      // Keeping the existing address ID
      addressId = userDetails.address._id;
    } else {
      // Creating new address
      const newAddress = new Address({ addressLine1, city, country });
      await newAddress.save();

      // Assigning the new address ID
      addressId = newAddress._id;
    }

    // updating the user with the new address values
    const associatedUser = await User.findByIdAndUpdate(
      userId,
      { name, address: addressId },
      { new: true }
    )
      .lean()
      .populate("address");

    if (associatedUser) {
      const { password, ...userWithoutPassword } = associatedUser;
      res.status(200).json({
        message: "Profile updated successfully",
        user: userWithoutPassword,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log("Error in updateUserProfile controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default { getUserProfile, updateUserProfile };
