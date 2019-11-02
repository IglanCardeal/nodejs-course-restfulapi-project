import express from "express";
import { body } from "express-validator";
import authController from "../controllers/auth";

const router = express.Router();

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email adress!")
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 5 })
      .withMessage('Please enter a valid password wiht minimun 5 characters!'),
    body("name")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please enter your user name!")
  ],
  authController.signup
);

export default router;
