import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.DATABASE}`);
    console.log("DATA CONNECT");
  } catch (error) {
    console.log("DATA CONNECT ENABLE", error);
  }
};
