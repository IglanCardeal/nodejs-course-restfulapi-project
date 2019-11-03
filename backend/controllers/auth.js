import UsersModel from "../models/users";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// *******************> colocar private key nas variaveis de ambiente
const PRIVATE_KEY = `MIGsAgEAAiEAq6IuOMeSqjKIXpyrT//MQjmvEBgAqlb/rwY3ECtu/GECAwEAAQIh
AJA8G8HlnZBgJQ/1c1Yoblq6L2aYU9QPft/EEAzu8X7NAhEA7PJZP/KQ+WJXT6yk
FLd2/wIRALlvVPfKgyl52jPUT2U37J8CEDW9gaCPU3I8a7EWZuCL++ECEQCLjV6r
kMt+5kYxpUEPErRPAhEA0jzBA675ZLARAgK54Ec2XA==`;

// ===================== utils =====================
const authErrorHandler = (message, statusCode) => {
  let error;
  if (typeof message !== "string" || typeof statusCode !== "number") {
    error = new Error(
      'Server error! Type of message or type of status code is an invalid type! Check "authErrorController" function on auth.js controller.'
    );
    error.statusCode = 500;
    throw error;
  }
  error = new Error(message);
  error.statusCode = statusCode;
  throw error;
};
// =================================================

export default {
  signup: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        authErrorHandler(errors.array()[0].msg, 422)
      }
      const { email, name, password } = req.body;
      const emailAlreadyExists = await UsersModel.findOne({ email: email });
      if (emailAlreadyExists) {
        authErrorHandler("Email already exists! Try another one.", 422)
      }
      const strength = 12;
      const hashedPassword = await bcrypt.hash(password, strength);
      const newUser = new UsersModel({
        email: email,
        name: name,
        password: hashedPassword
      });
      await newUser.save();
      return res.status(201).json({
        message: "User created successfully!",
        userId: newUser._id
      });
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        authErrorHandler(errors.array()[0].msg, 422)
      }
      const { email, password } = req.body;
      const userFinded = await UsersModel.findOne({ email: email });
      if (!userFinded) {
        authErrorHandler("User not found! Try again.", 404)
      }
      const isPasswordCorrect = await bcrypt.compare(
        password,
        userFinded.password
      );
      if (!isPasswordCorrect) {
        authErrorHandler("Incorrect password! Try again.", 401)
      }
      const token = jwt.sign(
        {
          email: userFinded.email,
          userId: userFinded._id.toString()
        },
        PRIVATE_KEY,
        {
          expiresIn: "1h" // expira em 1 hora
        }
      );
      res.status(200).json({ token: token, userId: userFinded._id.toString() });
    } catch (error) {
      next(error);
    }
  }
};