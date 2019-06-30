export default {
  getPosts: (req, res, next) => {
    res.status(200).json({
      posts: [
        {
          title: "First Post",
          content: "Content of the first Post."
        }
      ]
    });
  },

  createPost: (req, res, next) => {
    const { title, content } = req.body;
    // create post in DB.
    res.status(201).json({
      message: "Post create successfully!.",
      post: {
        id: new Date().toDateString(),
        title,
        content
      }
    });
  }
};
