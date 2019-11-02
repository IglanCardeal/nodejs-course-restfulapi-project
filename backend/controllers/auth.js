import Users from "../models/users";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";

export default {
  signup: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error(errors.array()[0].msg);
        error.statusCode = 422;
        throw error;
      }
      const { email, name, password } = req.body;
      const emailAlreadyExists = await Users.findOne({ email: email });
      if (emailAlreadyExists) {
        const error = new Error("Email already exists! Try another one.");
        error.statusCode = 422;
        throw error;
      }
      const strength = 12;
      const hashedPassword = await bcrypt.hash(password, strength);
      const newUser = new Users({
        email: email,
        name: name,
        password: hashedPassword
      });
      console.log("SUCCESS!!!!!!!!!!!!!!!");
      // await newUser.save();
      // return res.status(201).json({
      //   message: "User created successfully!",
      //   userId: newUser._id
      // });
    } catch (error) {
      next(error);
    }
  }
};
