import express from "express";
import { body } from "express-validator";

import feedController from "../controllers/feed";

const router = express.Router();

const postPostValidator = () => [
  body("title")
    .trim()
    .isLength({ min: 5 }),
  body("content")
    .trim()
    .isLength({ min: 5 })
];

router.get("/posts", feedController.getPosts);
router.post("/post", postPostValidator(), feedController.createPost);

export default router;
