import { validationResult } from "express-validator";
import path from "path";
import fs from "fs";
import PostsModel from "../models/posts";

export default {
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
      if (!postFinded) {
        const error = new Error("Post not found!");
        error.statusCode = 404;
        throw error;
      }
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

  getPost: async (req, res, next) => {
    const postId = req.params.postId;
    try {
      const postFinded = await PostsModel.findById(postId);
      if (!postFinded) {
        const error = new Error("Post not found!");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Post fetched!", post: postFinded });
    } catch (error) {
      next(error);
    }
  }
};

// ===================== utils =====================

const clearImageFileFromSystem = imagePath => {
  // deleta arquivos de imagens antigos quando estes forem atualizados.
  fs.unlink(path.join(__dirname, "..", imagePath), error => {
    if (error) console.log(error);
  });
};
