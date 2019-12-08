import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_DB_PORT = process.env.DATABASE_PORT;
const DATABASE_NAME = process.env.DATABASE_NAME;
const MONGO_DB_URL = `mongodb://localhost:${MONGO_DB_PORT}/${DATABASE_NAME}`;

export default callback => {
  const connectionCallback = error => {
    if (error) {
      throw new Error(
        "Unable to connect MongoDB! Application will not execute due connection failed."
      );
    }
    console.log(`
      MongoDB connection successful!
      Database name: ${DATABASE_NAME}
      Database port: ${MONGO_DB_PORT}
      Database URL: ${MONGO_DB_URL}\n
    `);
    return callback();
  };

  const connectionObject = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  };

  try {
    mongoose.connect(MONGO_DB_URL, connectionObject, connectionCallback);
  } catch (error) {
    console.error(error);
  }
};
