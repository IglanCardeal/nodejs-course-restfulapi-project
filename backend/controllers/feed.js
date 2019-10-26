import { validationResult } from "express-validator";
import path from "path";
import fs from "fs";
import PostsModel from "../models/posts";

export default {
  getPost: async (req, res, next) => {
    const postId = req.params.postId;
    try {
      const postFinded = await PostsModel.findById(postId);
      if (!postFinded) caseOfPostNotFound("Post not found!", 404);
      res.status(200).json({ message: "Post fetched!", post: postFinded });
    } catch (error) {
      next(error);
    }
  },

  getPosts: async (req, res, next) => {
    try {
      const posts = await PostsModel.find();
      res.status(200).json({ message: "Fetched posts.", posts });
    } catch (error) {
      next(error);
    }
  },

  createPost: async (req, res, next) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      const error = new Error("Validation failed!");
      error.statusCode = 422;
      throw error;
    }
    if (!req.file) {
      const error = new Error("No image provided!");
      error.statusCode = 422;
      throw error;
    }
    try {
      const { title, content } = req.body;
      const imageUrl = req.file.path;
      // cria novo post.
      const newPost = new PostsModel({
        title,
        content,
        imageUrl: imageUrl,
        creator: {
          name: "Me Myself"
        }
      });
      await newPost.save();
      res.json({
        message: "Post created successfully!",
        post: newPost
      });
    } catch (error) {
      next(error);
    }
  },

  editPost: async (req, res, next) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      const error = new Error("Validation failed!");
      error.statusCode = 422;
      throw error;
    }
    const postId = req.params.postId;
    const { title, content } = req.body;
    let imageUrl = req.body.image;
    if (req.file) {
      imageUrl = req.file.path;
    }
    if (!imageUrl) {
      const error = new Error("No file picked!");
      error.statusCode = 422;
      throw error;
    }
    try {
      const postFinded = await PostsModel.findById(postId);
      if (!postFinded)
        caseOfPostNotFound("Post not found! Unable to edit post.", 404);
      if (imageUrl !== postFinded.imageUrl) {
        clearImageFileFromSystem(postFinded.imageUrl); // remove imagem antiga que nao sera mais usada.
      }
      postFinded.title = title;
      postFinded.content = content;
      postFinded.imageUrl = imageUrl;
      await postFinded.save();
      return res
        .status(200)
        .json({ message: "Post update success!", post: postFinded });
    } catch (error) {
      next(error);
    }
  },

  deletePost: async (req, res, next) => {
    const postId = req.params.postId;
    try {
      const postFinded = await PostsModel.findById(postId);
      if (!postFinded)
        caseOfPostNotFound("Post not founded! Unable to delete.", 404);
      await PostsModel.deleteOne({ id: postFinded._id });
      return res.status(200).json({
        message: "Post delete success!"
      });
    } catch (error) {
      next(error);
    }
  }
};

// ===================== utils =====================

const clearImageFileFromSystem = imagePath => {
  // deleta arquivos de imagens antigos quando estes forem atualizados na edicao do post.
  fs.unlink(path.join(__dirname, "..", imagePath), error => {
    if (error) console.log(error);
  });
};

const caseOfPostNotFound = (message, statusCode) => {
  let error;
  if (typeof message !== "string" || typeof statusCode !== "number") {
    error = new Error(
      'Type of message or type of status code is invalid! Check "caseOfPostNotFound" function on feed.js controller.'
    );
    error.statusCode = 500;
    throw error;
  }
  error = new Error(message);
  error.statusCode = statusCode;
  throw error;
};
