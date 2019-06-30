import express from "express";
import bodyParser from "body-parser";

import feedRoutes from "./routes/feed";

const PORT = process.env.PORT || 8080;
const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, PUT, PATCH"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return next();
});

app.use("/feed", feedRoutes);

app.listen(PORT, () => {
  console.log(`Server ON PORT: ${PORT}`);
});
