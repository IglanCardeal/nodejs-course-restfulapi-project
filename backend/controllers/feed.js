import { validationResult } from "express-validator";
import path from "path";
import fs from "fs";
import PostsModel from "../models/posts";
import UsersModel from "../models/users";

// ===================== utils =====================
const clearImageFileFromSystem = imagePath => {
  // deleta arquivos de imagens antigos quando estes forem atualizados na edicao do post.
  fs.unlink(path.join(__dirname, "..", imagePath), error => {
    if (error) console.log(error);
  });
};

const feedErrorHandler = (message, statusCode) => {
  let error;
  if (typeof message !== "string" || typeof statusCode !== "number") {
    error = new Error(
      'Server error! Type of message or type of status code is an invalid type! Check "feedErrorHandler" function on feed.js controller.'
    );
    error.statusCode = 500;
    throw error;
  }
  error = new Error(message);
  error.statusCode = statusCode;
  throw error;
};
// ===============================================

export default {
  getPost: async (req, res, next) => {
    try {
      const postId = req.params.postId;
      const postFinded = await PostsModel.findById(postId);
      if (!postFinded) {
        feedErrorHandler("Post not found!", 404);
      }
      const user = await UsersModel.findById(postFinded.creator);
      res.status(200).json({
        message: "Post fetched!",
        post: postFinded,
        username: user.name
      });
    } catch (error) {
      next(error);
    }
  },

  getPosts: async (req, res, next) => {
    try {
      const currentPage = req.query.page || 1;
      const perPage = 2; // quantidade de post por pagina.
      const totalItems = await PostsModel.find().countDocuments(); // numero total de posts.
      const posts = await PostsModel.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
      // 'totalItems' e tratado no front para exibir os botoes 'prev' e 'next'.
      res.status(200).json({ message: "Fetched posts.", posts, totalItems });
    } catch (error) {
      next(error);
    }
  },

  createPost: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        feedErrorHandler(errors.array()[0].msg, 422);
      }
      if (!req.file) {
        feedErrorHandler("No image provided!", 422);
      }
      const { title, content } = req.body;
      const imageUrl = req.file.path;
      const newPost = new PostsModel({
        title,
        content,
        imageUrl: imageUrl,
        creator: req.userId
      });
      const user = await UsersModel.findById(req.userId);
      user.posts.push(newPost);
      await newPost.save();
      await user.save();
      res.json({
        message: "Post created successfully!",
        post: newPost,
        creator: {
          id: user._id,
          name: user.name
        }
      });
    } catch (error) {
      next(error);
    }
  },

  editPost: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        feedErrorHandler(errors.array()[0].msg, 422);
      }
      const postId = req.params.postId;
      const { title, content } = req.body;
      let imageUrl = req.body.image;
      if (req.file) {
        imageUrl = req.file.path;
      }
      if (!imageUrl) {
        feedErrorHandler("No file picked!", 422);
      }
      const postFinded = await PostsModel.findById(postId);
      if (!postFinded) {
        feedErrorHandler("Post not found! Unable to edit post.", 404);
      }
      const postDoNotBelongsToUser = Boolean(
        postFinded.creator.toString() !== req.userId
      );
      if (postDoNotBelongsToUser) {
        feedErrorHandler("Not authorized action!", 403);
      }
      if (imageUrl !== postFinded.imageUrl) {
        clearImageFileFromSystem(postFinded.imageUrl);
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
    try {
      const postId = req.params.postId;
      const postFinded = await PostsModel.findById(postId);
      if (!postFinded) {
        feedErrorHandler("Post not founded! Unable to delete.", 404);
      }
      const postDoNotBelongsToUser = Boolean(
        postFinded.creator.toString() !== req.userId
      );
      if (postDoNotBelongsToUser) {
        feedErrorHandler("Not authorized action!", 403);
      }
      const user = await UsersModel.findById(req.userId);
      if (!user) {
        feedErrorHandler("User not found!", 404);
      }
      user.posts.pull(postFinded._id);
      await user.save();
      await PostsModel.deleteOne({ _id: postFinded._id });
      clearImageFileFromSystem(postFinded.imageUrl);
      return res.status(200).json({
        message: "Post delete success!"
      });
    } catch (error) {
      next(error);
    }
  },

  getStatus: async (req, res, next) => {
    try {
      const user = await UsersModel.findById(req.userId);
      if (!user) {
        feedErrorHandler("User not found!", 404);
      }
      res.status(200).json({ status: user.status });
    } catch (error) {
      next(error);
    }
  },

  updateStatus: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        feedErrorHandler(errors.array()[0].msg, 401);
      }
      const user = await UsersModel.findById(req.userId);
      if (!user) {
        feedErrorHandler("User not found!", 404);
      }
      const newUserStatus = req.body.status;
      user.status = newUserStatus;
      await user.save();
      res.status(201).json({ message: "Status updated successfully!" });
    } catch (error) {
      next(error);
    }
  }
};
