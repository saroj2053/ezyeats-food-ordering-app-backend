import express, { Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import connectToDB from "./config/db";

// connection to database
connectToDB();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", async (req: Request, res: Response) => {
  res.json({ status: "success", message: "Hello world!!" });
});

const PORT: number = 8000;

app.listen(PORT, () => {
  console.log(`Server started on localhost:${PORT}`);
});
