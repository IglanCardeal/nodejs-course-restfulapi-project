import express from 'express';
import { body } from 'express-validator';
import feedController from '../controllers/feed';
import checkAuth from '../middleware/check-auth';

const router = express.Router();

const postPostValidator = () => [
  body('title')
    .trim()
    .isLength({ min: 5 }),

  body('content')
    .trim()
    .isLength({ min: 5 }),
];

router.get('/posts', checkAuth, feedController.getPosts);
router.get('/post/:postId', checkAuth, feedController.getPost);
router.post('/post', checkAuth, postPostValidator(), feedController.createPost);
router.put(
  '/post/:postId',
  checkAuth,
  postPostValidator(),
  feedController.editPost,
);
router.delete('/post/:postId', checkAuth, feedController.deletePost);

router.get('/status', checkAuth, feedController.getStatus);
router.put(
  '/status',
  checkAuth,
  [
    body('status')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Write something to update your status!'),
  ],
  feedController.updateStatus,
);

export default router;
