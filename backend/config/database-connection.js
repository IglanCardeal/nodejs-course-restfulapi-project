import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_DB_PORT = process.env.DATABASE_PORT;
const DATABASE_NAME = process.env.DATABASE_NAME;
const MONGO_DB_URL = `mongodb://localhost:${MONGO_DB_PORT}/${DATABASE_NAME}`;

export default callback =>
  mongoose.connect(
    MONGO_DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    error => {
      if (error) {
        console.log(
          "Unable to connect MongoDB! Application will not execute due connection failed.",
          error
        );
        process.exit(1);
      }
      console.log(`
        MongoDB connection successful!
        Database name: ${DATABASE_NAME}
        Database port: ${MONGO_DB_PORT}
        Database URL: ${MONGO_DB_URL}\n
      `);
      return callback();
    }
  );
