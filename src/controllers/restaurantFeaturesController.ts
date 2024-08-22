import { Request, Response } from "express";
import Restaurant from "../models/restaurant";

const getRestaurantDetails = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;
    const foundRestaurant = await Restaurant.findById(restaurantId);

    if (!foundRestaurant) {
      res.status(404).json({ message: "restaurant not found" });
    }

    res.json(foundRestaurant); //when we say json, it automatically adds a status code of 200
  } catch (error) {
    console.log("error in getRestaurantDetails controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const searchRestaurants = async (req: Request, res: Response) => {
  try {
    const city = req.params.city;

    const searchQuery = (req.query.searchQuery as string) || "";
    const selectedCuisines = (req.query.selectedCuisines as string) || "";
    const sortOption = (req.query.sortOption as string) || "lastUpdated";
    const page = parseInt(req.query.page as string) || 1;

    let query: any = {};

    // chemnitz or Chemnitz
    query["city"] = new RegExp(city, "i");

    const cityCheck = await Restaurant.countDocuments(query);
    if (cityCheck == 0) {
      return res
        .status(404)
        .json({ data: [], pagination: { total: 0, page: 1, pages: 1 } });
    }

    if (selectedCuisines) {
      const cuisinesArray = selectedCuisines
        .split(",")
        .map((cuisine) => new RegExp(cuisine, "i"));
      query["cuisines"] = { $all: cuisinesArray };
    }

    if (searchQuery) {
      // restaurantName = Pizza Palace
      // cuisines = [Pizza, Pasta, italian]
      // searchQuery = Pasta
      const searchRegex = new RegExp(searchQuery, "i");
      query["$or"] = [
        { restaurantName: searchRegex },
        { cuisines: { $in: [searchRegex] } },
      ];
    }

    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const restaurants = await Restaurant.find(query)
      .sort({ [sortOption]: 1 })
      .skip(skip)
      .limit(pageSize)
      .lean();

    const total = await Restaurant.countDocuments(query);

    const response = {
      data: restaurants,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / pageSize),
      },
    };

    res.json(response);
  } catch (error) {
    console.log("error in searchRestaurants controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default { searchRestaurants, getRestaurantDetails };
