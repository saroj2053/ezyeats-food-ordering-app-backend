import mongoose from "mongoose";
import "dotenv/config";

const DB = process.env.MONGODB_URI as string;

const connectToDB = async () => {
  var conn = await mongoose.connect(DB);
  if (conn) {
    console.log(`Connected to database ${conn.connection.host}`);
  } else {
    console.log("Error connecting to database");
  }
};

export default connectToDB;
