import express, { Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import connectToDB from "./config/db";
import authRoute from "./routes/authRoute";
import userRoute from "./routes/userRoute";
import restaurantRoute from "./routes/restaurantRoute";
import restaurantFeaturesRoute from "./routes/restaurantFeaturesRoute";
import { v2 as cloudinary } from "cloudinary";

// connection to database
connectToDB();

// cloudinary setup
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(express.json());
app.use(cors());

app.get("/health", async (req: Request, res: Response) => {
  res.send({ message: "health OK!" });
});

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/restaurant", restaurantRoute);
app.use("/api/restaurant/features", restaurantFeaturesRoute);

app.get("/", async (req: Request, res: Response) => {
  res.json({ status: "success", message: "Hello world!!" });
});

const PORT: number = 8000;

app.listen(PORT, () => {
  console.log(`Server started on localhost:${PORT}`);
});
