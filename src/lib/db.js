import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGOOSE_URL);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting Database", error);
    process.exit(1);
  }
};
