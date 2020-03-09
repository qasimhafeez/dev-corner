const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Importing models
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

// Validation
const validatePostInput = require("../../validation/post");

// @route   GET api/posts
// @desc    Get posts
// @access  Public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ postNotFound: "Post not found!" }));
});

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ postNotFound: "Post not found!" }));
});

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });
    newPost.save().then(post => res.json(post));
  }
);

// @route   DELETE api/posts
// @desc    Delete post
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id).then(post => {
        if (post.user.toString() !== req.user.id) {
          return res.status(401).json({ noAuthorized: "User not authorized!" });
        }

        post
          .remove()
          .then(() => res.json({ success: true }))
          .catch(err =>
            res.status(404).json({ postNotFound: "Post not found!" })
          );
      });
    });
  }
);

// @route   POST api/posts/like/:id
// @desc    Like post
// @access  Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.like.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyLiked: "You have already liked this post!" });
          }

          // Add user id to likes array
          post.likes.unshift({ user: req.user.id });
          post.save().then(post => res.json(post));
        })
        .catch(err =>
          res.status(404).json({ postNotFound: "Post not found!" })
        );
    });
  }
);

// @route   POST api/posts/like/:id
// @desc    Unlike post
// @access  Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.like.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notLiked: "You have not yet liked this post!" });
          }

          // Get remove index from likes array
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          // Remove the index
          post.likes.splice(removeIndex, 1);

          // Save
          post.save().then(post => res.json(post));
        })
        .catch(err =>
          res.status(404).json({ postNotFound: "Post not found!" })
        );
    });
  }
);

// @route   POST api/posts/comment/:id
// @desc    Add comment to post
// @access  Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Validation
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
      res.status(400).json(errors);
    }

    // Find post and add a comment
    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        // Add comments to array
        post.comments.unshift(newComment);

        // Save
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postNotFound: "Post not found!" }));
  }
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete comment from post
// @access  Private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Find post
    Post.findById(req.params.id)
      .then(post => {
        // Check if comment exists
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          res.status(404).json({ commentNotExists: "Comment does not exist!" });
        }

        // Remove Index if exists
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.param.comment_id);

        // Remove from array
        post.comments.splice(removeIndex, 1);
        // Save
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postNotFound: "Post not found!" }));
  }
);

module.exports = router;
