import { validationResult } from "express-validator";
import PostsModel from "../models/posts";

export default {
  getPosts: (req, res, next) => {
    res.status(200).json({
      posts: [
        {
          _id: 1,
          title: "First Post",
          creator: {
            name: "Me Myself"
          },
          content: "Content of the first Post.",
          imageUrl:
            "https://media.gazetadopovo.com.br/2016/12/a12fe5a3a1615c8e6ed52d5f7291ed80-gpMedium.jpg",
          createdAt: new Date().toISOString()
        }
      ]
    });
  },

  createPost: async (req, res, next) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      const error = new Error("Validation failed!");
      error.statusCode = 422;
      throw error;
      // return res
      //   .status(422)
      //   .json({ message: "Validation failed!", errors: erros.array() });
    }
    try {
      const { title, content } = req.body;
      // cria novo post.
      const newPost = new PostsModel({
        title,
        content,
        imageUrl:
          "https://media.gazetadopovo.com.br/2016/12/a12fe5a3a1615c8e6ed52d5f7291ed80-gpMedium.jpg",
        creator: {
          name: "Me Myself"
        }
      });
      await newPost.save();
      res.json({
        message: "Post created successfully!",
        post: newPost
      });
      // res.status(201).json({
      //   message: "Post create successfully!.",
      //   post: {
      //     _id: new Date().toDateString(),
      //     title,
      //     content,
      //     creator: {
      //       name: "Cardeal"
      //     },
      //     createdAt: new Date()
      //   }
      // });
    } catch (error) {
      if (!error.statusCode) error.statusCode = 500;
      next(error);
    }
  }
};
