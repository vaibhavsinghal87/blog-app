var express = require('express');
var router = express.Router();
const PostsModel = require("../models/posts");
const authMiddleware = require("../authMiddleware");

// get all post
router.get("/", async (req, res) => {
  try {
    const posts = await PostsModel.find({});
    res.status(200).json({
      status: 200,
      data: posts
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// get a post by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await PostsModel.findOne({ _id: id });
    if (post) {
      res.status(200).json({
        status: 200,
        data: post
      });
    }
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});

// add a post
router.post("/", authMiddleware, async (req, res) => {
  try {
    let post = new PostsModel(req.body);
    post = await post.save();
    res.status(200).json({
      status: 200,
      data: post,
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});

// delete a post
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    PostsModel.findByIdAndDelete(id).then(() => {
      res.status(200).json({
        status: 200,
        success: true
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

module.exports = router;
