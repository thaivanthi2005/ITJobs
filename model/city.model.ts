import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: String
  }
);

const City = mongoose.model('City', schema, "cities");

export default City;