const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const { requireLogin } = require("../middlware/requireLogin");
const Post = require("../models/Post");
/* -------------------------------------------------------------------------- */
/*                                  ALL_POST                                  */
/* -------------------------------------------------------------------------- */
router.get("/allpost", requireLogin, (req, res) => {
  Post.find()
    .populate("postedby", "_id name avatar")
    .populate("comments.postedby", "_id name")
    .sort("-createdAt")
    .then((post) => {
      res.json(post);
    })
    .catch((err) => {
      console.log(err);
    });
});
/* -------------------------------------------------------------------------- */
/*                                 POST BY ID                                 */
/* -------------------------------------------------------------------------- */
router.get("/post/:id", requireLogin, (req, res) => {
  Post.findById({ _id: req.params.id })
    .populate("postedby", "_id name avatar")
    .populate("comments.postedby", "_id name")
    .sort("-createdAt")
    .then((post) => {
      res.json(post);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});
/* -------------------------------------------------------------------------- */
/*                                   MY_POST                                  */
/* -------------------------------------------------------------------------- */
router.get("/myposts", requireLogin, (req, res) => {
  Post.find({ postedby: req.user._id })
    .populate("postedby", "_id name avatar")
    .populate("comments.postedby", "_id name")
    .then((mypost) => {
      res.json(mypost);
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/getsubpost", requireLogin, (req, res) => {
  Post.find({ postedby: { $in: req.user.following } })
    .populate("postedby", "_id name")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt")
    .then((post) => {
      res.json(post);
    })
    .catch((err) => {
      console.log(err);
    });
});
/* -------------------------------------------------------------------------- */
/*                                 CREATE_POST                                */
/* -------------------------------------------------------------------------- */
router.post("/create-post", requireLogin, (req, res) => {
  const { title, photo } = req.body;
  if (!title) {
    return res.status(422).json({ error: "please add all the fields" });
  }
  req.user.password = undefined;
  const post = new Post({
    title,
    photo: photo,
    postedby: req.user,
  });
  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((err) => {
      console.log(err);
    });
});
/* -------------------------------------------------------------------------- */
/*                              LIKE_UNLIKE_POST                              */
/* -------------------------------------------------------------------------- */
router.put("/like", requireLogin, (req, res) => {
  var io = req.app.get("socketio");
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: {
        likes: req.user._id,
      },
    },
    {
      new: true,
    }
  )
    .populate("postedby", "_id name avatar socketId")
    .exec((err, result) => {
      postedById = result.postedby._id.toString();
      socketId = result.postedby.socketId.toString();
      if (err) {
        return res.status(422).json({ error: err });
      } else if (req.user._id === postedById) {
        res.json(result);
      } else if (req.user._id !== postedById) {
        res.json(result);
        notification = new Notification({
          user: postedById,
          sender: req.user._id,
          type: "like",
          post: result._id,
        });
        notification.save(function (err, notification) {
          notification.populate("sender", "_id name avatar");
          notification
            .populate("user", "_id name avatar")
            .then(function (notifcationResult) {
              io.to(socketId).emit("notifications", { notifcationResult });
            });
        });
      }
    });
});
router.put("/unlike", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: {
        likes: req.user._id,
      },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});
/* -------------------------------------------------------------------------- */
/*                                   COMMENT                                  */
/* -------------------------------------------------------------------------- */
router.put("/comment", requireLogin, (req, res) => {
  var io = req.app.get("socketio");
  const comment = {
    text: req.body.comment,
    postedby: req.user._id,
  };
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: {
        comments: comment,
      },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedby", "_id name")
    .populate("postedby", "_id name socketId")
    .exec((err, result) => {
      console.log("result:", result);
      postedById = result.postedby._id.toString();
      socketId = result.postedby.socketId.toString();
      if (err) {
        return res.status(422).json({ error: err });
      } else if (req.user._id === postedById) {
        res.json(result);
      } else if (req.user._id !== postedById) {
        res.json(result);
        notification = new Notification({
          user: postedById,
          sender: req.user._id,
          type: "comment",
          post: result._id,
        });
        notification.save(function (err, notification) {
          notification.populate("sender", "_id name avatar");
          notification
            .populate("user", "_id name avatar")
            .then(function (notifcationResult) {
              io.to(socketId).emit("notifications", { notifcationResult });
            });
        });
      }
    });
});
/* -------------------------------------------------------------------------- */
/*                                 DELETE_POST                                */
/* -------------------------------------------------------------------------- */
router.delete("/delepost/:postId", requireLogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedby", "_id")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: err });
      }
      if (post.postedby._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            res.json(result);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
});

module.exports = router;
