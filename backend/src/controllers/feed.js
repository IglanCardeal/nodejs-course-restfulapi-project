import { validationResult } from "express-validator";

import PostsModel from "../models/posts";
import UsersModel from "../models/users";
import socket from "../middleware/socket";

import clearImageFileFromSystem from "../utils/remove-imagefile";
import feedErrorHandler from "../utils/feed-error-handler";

const checkIfErrorsIsEmpty = (req, statusCode) => {
  const errors = validationResult(req);

  const errorsIsNotEmpty = !errors.isEmpty();

  if (errorsIsNotEmpty) {
    return feedErrorHandler(errors.array()[0].msg, statusCode);
  }
};

export default {
  getPost: async (req, res, next) => {
    const postId = req.params.postId;

    try {
      const postFinded = await PostsModel.findById(postId).exec();

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
    const currentPage = req.query.page || 1;
    const perPage = 10; // quantidade de post por pagina.

    try {
      const totalItems = await PostsModel.find().countDocuments(); // numero total de posts.

      const posts = await PostsModel.find()
        .sort({ createdAt: -1 })
        .populate("creator")
        .skip((currentPage - 1) * perPage)
        .limit(perPage);

      // 'totalItems' e tratado no front para exibir os botoes 'prev' e 'next'.
      res.status(200).json({ message: "Fetched posts.", posts, totalItems });
    } catch (error) {
      next(error);
    }
  },

  createPost: async (req, res, next) => {
    checkIfErrorsIsEmpty(req, 422);

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

    try {
      const user = await UsersModel.findById(req.userId);
      user.posts.push(newPost);

      Promise.all([newPost.save(), user.save()]);

      socket.getIO().emit("post", {
        action: "create",
        post: {
          ...newPost._doc,
          creator: {
            id: user._id,
            name: user.name
          }
        }
      });

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
    // statusCode 422
    checkIfErrorsIsEmpty(req, 422);

    const postId = req.params.postId;
    const { title, content } = req.body;
    let imageUrl = req.body.image;

    if (req.file) {
      imageUrl = req.file.path;
    }

    if (!imageUrl) {
      feedErrorHandler("No file picked!", 422);
    }

    try {
      const postFinded = await PostsModel.findById(postId).populate("creator");

      if (!postFinded) {
        feedErrorHandler("Post not found! Unable to edit post.", 404);
      }

      const postDoNotBelongsToUser = Boolean(
        postFinded.creator._id.toString() !== req.userId
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

      const result = await postFinded.save();
      socket.getIO().emit("post", {
        action: "update",
        post: result
      });

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

      Promise.all([user.save(), PostsModel.deleteOne({ _id: postFinded._id })]);

      clearImageFileFromSystem(postFinded.imageUrl);

      socket.getIO().emit("post", {
        action: "delete",
        _id: postFinded._id
      });

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
    checkIfErrorsIsEmpty(req, 401);

    try {
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
