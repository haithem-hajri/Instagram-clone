const express = require("express");
const router = express.Router();
const { requireLogin } = require("../middlware/requireLogin");
const Post = require("../models/Post");
const User = require("../models/User");
const Notification = require("../models/Notification");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
/* -------------------------------------------------------------------------- */
/*                                  GET_USER                                  */
/* -------------------------------------------------------------------------- */
router.get("/user", requireLogin, (req, res) => {
  User.findById(req.user._id)
    .select("-password")
    .then((user) => {
      Notification.find({ user: user._id })
        
        .populate("user", "_id name avatar")
        .populate("sender", "_id name avatar")
        .sort({"createdAt": -1})
        .limit(9)
        .then((result) => {
          const { _id, name, email, followers, following, avatar } = user;
          res.status(200).json({
            user: {
              _id,
              name,
              email,
              followers,
              following,
              avatar,
            },
            notifications: result,
          });
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});
router.get("/user/:id", requireLogin, (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      Post.find({ postedby: req.params.id })
        .populate("postedby", "_id name avatar")
        .populate("comments.postedby", "_id name")
        .exec((err, post) => {
          if (err) {
            return res.status(422).json({ error: err });
          }
          res.json({ user, post });
        });
    })
    .catch((err) => {
      return res.status(404).json({ error: "User not found" });
    });
});
/* -------------------------------------------------------------------------- */
/*                                   FOLLOW                                   */
/* -------------------------------------------------------------------------- */
router.put("/follow", requireLogin, (req, res) => {
  var io = req.app.get("socketio");

  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    {
      new: true, 
    },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      /// send real time notification to receiver
      const notification = new Notification({
        user: req.body.followId,
        sender: req.user._id,
        type: "follow",
      });
      notification.save(function (err, notification) {
        notification.populate("sender", "_id name avatar");
        notification
          .populate("user", "_id name avatar")
          .then(function (notifcationResult) {
            io.to(result.socketId).emit("notifications", { notifcationResult });
          });
      });

      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId },
        },
        { new: true }
      )
        .select("-password")
        //  .populate("notifications.sender", "_id name avatar")
        .then((user) => {
          // return data json to sender
          const { _id, name, email, followers, following, avatar } = user;
          res.status(200).json({
            user: {
              _id,
              name,
              email,
              followers,
              following,
              avatar,
            },
          });
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});
router.put("/unfollow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    {
      $pull: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.unfollowId },
        },
        { new: true }
      )
        .select("-password")
        .then((user) => {
          const { _id, name, email, followers, following, avatar } = user;
          res.status(200).json({
            user: {
              _id,
              name,
              email,
              followers,
              following,
              avatar,
            },
          });
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});
/* -------------------------------------------------------------------------- */
/*                                 UPDATE_USER                                */
/* -------------------------------------------------------------------------- */
router.put("/update-avatar", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { avatar: req.body.avatar } },
    { new: true },
    (err, result) => {
      const { _id, name, email, followers, following, avatar } = result;
      if (err) {
        return res.status(422).json({ error: "avatar cannot post" });
      }
      res.json({
        user: { _id, name, email, followers, following, avatar },
      });
    }
  );
});
router.put("/update-informations", requireLogin, (req, res) => {
  const { email, name } = req.body;
  User.findById(req.user._id).then((user) => {
    if (name) {
      user.name = name;
    }
    if (email) {
      User.findOne({ email: email }).then((saveduser) => {
        if (saveduser) {
          return res.status(422).json({ error: "email invalid" });
        }
        user.email = email;
      });
    }
    user
      .save()
      .then((user) => {
        const { _id, name, email, followers, following, avatar } = user;
        res.status(200).json({
          user: {
            _id,
            name,
            email,
            followers,
            following,
            avatar,
          },
        });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  });
});
router.put("/update-password", requireLogin, (req, res) => {
  const { newPassword, oldPassword } = req.body;
  if (oldPassword === "" || newPassword === "") {
    res.status(500).json("Please fill in all fields.");
  }

  User.findById(req.user._id)
    .then((user) => {
      bcrypt.compare(oldPassword, user.password, (err, isMatch) => {
        if (err) {
          res
            .status(500)
            .json({ oldPassword: "Current password is not a match.!" });
        }
        if (isMatch) {
          //Update password for user with new password
          bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(newPassword, salt, (err, hash) => {
              if (err) throw err;
              user.password = hash;
              user.save();
            })
          );
          res.status(200).json("Password successfully updated!");
        } else {
          //Password does not match
          res
            .status(500)
            .json({ newPassword: "Current password is not a match." });
        }
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});
/* -------------------------------------------------------------------------- */
/*                                 SEARCH_USER                                */
/* -------------------------------------------------------------------------- */
router.get("/search-users", (req, res) => {
  const search = req.query.search;
  const regex = new RegExp(search, "i");
  User.find({
    $and: [{ $or: [{ name: regex }, { email: regex }] }],
  })
    .select("-password")
    .limit(6)
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.log(err);
    });
});

/* -------------------------------------------------------------------------- */
/*                                 SUGGESTION                                 */
/* -------------------------------------------------------------------------- */
router.get("/suggestions", requireLogin, (req, res) => {
  User.find({ _id: { $ne: req.user._id }, followers: { $ne: req.user._id } })
    .select("-password")
    .limit(10)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

/* -------------------------------------------------------------------------- */
/*                             update_NOTIFICATIONS                            */
/* -------------------------------------------------------------------------- */
// ,
//     { $set: {notifications.readed: req.body.avatar } },
//     { new: true },
// router.put("/update-notifications", requireLogin, (req, res) => {
//   User.findByIdAndUpdate(req.user._id)
//     .populate("notifications.sender", "_id name avatar")
//     .select("-password")
//     .then((user) => {
//       user.notifications.map((notification) => (notification.readed = true));
//       // user.notifications = [];
//       user.save().then((savedUser) => {
//         const {
//           _id,
//           name,
//           email,
//           followers,
//           following,
//           avatar,
//           notifications,
//         } = savedUser;
//         res.status(200).json({
//           user: {
//             _id,
//             name,
//             email,
//             followers,
//             following,
//             avatar,
//             notifications,
//           },
//         });
//       });
//     })
//     .catch((err) => {
//       return res.status(422).json({ error: err });
//     });
// });
module.exports = router;
