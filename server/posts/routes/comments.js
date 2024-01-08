var express = require('express');
var router = express.Router();
const PostsModel = require("../models/posts");
const CommentsModel = require("../models/comments");

// create a comment
router.post("/:postId/comments", async (req, res) => {
  let { postId } = req.params;
  PostsModel.findOne({ _id: postId }).then(async (post) => {
    if (!post) {
      return res.status(400).send({
        message: 'No post found',
        data: {}
      });
    } else {
      try {
        let commentDocument = new CommentsModel({
          postId,
          comment: req.body.comment,
          userId: '' // append user id after auth
        });

        // save comment in DB
        let commentData = await commentDocument.save();

        // posts MS should update this
        await PostsModel.updateOne(
          { _id: postId },
          {
            $push: { commentId: commentData._id }
          }
        );

        return res.status(200).send({
          message: 'Comment successfully added',
          data: commentData
        });
      } catch (err) {
        return res.status(400).send({
          status: 400,
          message: err.message,
        });
      }
    }
  }).catch((err) => {
    return res.status(400).send({
      status: 400,
      message: err.message,
    });
  });
});

// get all comments for a post
router.get("/:postId/comments", async (req, res) => {
  let { postId } = req.params;
  PostsModel.findOne({ _id: postId }).then(async (post) => {
    if (!post) {
      return res.status(400).send({
        message: 'No post found',
        data: {}
      });
    } else {
      try {
        CommentsModel.find({ postId }).then(async (data) => {
          console.log(data);
          return res.send({
            status: 400,
            comments: data
          });
        });
      } catch (err) {
        return res.status(400).send({
          message: err.message,
          data: err
        });
      }
    }
  }).catch((err) => {
    return res.status(400).send({
      status: 400,
      message: err.message,
    });
  })
});

// delete a comment
router.delete('/comments/:commentId', async (req, res) => {
  let { commentId } = req.params;
  CommentsModel.findOne({ _id: commentId }).then(async (comment) => {
    if (!comment) {
      return res.status(400).send({
        message: 'No comment found',
        data: {}
      });
    } else {
      try {
        await CommentsModel.deleteOne({ _id: commentId });
        await PostsModel.updateOne(
          { _id: comment.postId },
          {
            $pull: { commentId }
          }
        );
        return res.status(200).send({
          message: 'Comment successfully deleted',
          data: {}
        });
      } catch (err) {
        return res.status(400).send({
          message: err.message,
          data: err
        });
      }
    }
  }).catch((err) => {
    return res.status(400).send({
      status: 400,
      message: err.message,
    });
  })
});

module.exports = router;
