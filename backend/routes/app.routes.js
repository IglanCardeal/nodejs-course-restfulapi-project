import { Router } from "express";

import feedRoutes from "./feed";
import authRoutes from "./auth";

const routes = Router();

routes.use("/feed", feedRoutes);
routes.use("/auth", authRoutes);

module.exports = routes;
