import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();

const DBConnector = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.DB_URL}`);
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};

export default DBConnector;
