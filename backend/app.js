import path from "path";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import feedRoutes from "./routes/feed";

const PORT = process.env.PORT || 8080;
const app = express();

app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // permite todas as origens.
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, PUT, PATCH" // metodos de request aceitos.
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // headers de request aceitos.
  return next();
});

app.use("/feed", feedRoutes);
app.use((error, req, res, next) => {
  // tratamento geral de erros, executa sempre que tiver um next(error).
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message });
});

const mongoPort = 27017;
const database = "my-api";
const mongoUrl = `mongodb://localhost:${mongoPort}/${database}`;

mongoose.connect(mongoUrl, { useNewUrlParser: true }, error => {
  if (error) {
    console.log(error);
    process.exit(1);
  }
  app.listen(PORT, () => {
    console.log(`MongoDB connection successful!\nURL = ${mongoUrl}\n`);
    console.log(`API Server running on port: ${PORT}`);
  });
});
