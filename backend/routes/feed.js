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
router.get("/post/:postId", feedController.getPost);
router.post("/post", postPostValidator(), feedController.createPost);
router.put("/post/:postId", postPostValidator(), feedController.editPost);
router.delete("/post/:postId", feedController.deletePost);

export default router;
