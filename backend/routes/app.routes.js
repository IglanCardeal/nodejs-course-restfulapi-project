import { Router } from "express";

import feedRoutes from "./feed";
import authRoutes from "./auth";

const routes = Router();

routes.use(feedRoutes);
routes.use(authRoutes);

module.exports = routes;
