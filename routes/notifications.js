const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const User = require("../models/User");
const Post = require("../models/Post");

const { requireLogin } = require("../middlware/requireLogin");

router.put("/update-notifications", requireLogin, (req, res) => {
  Notification.updateMany(
    { user: req.user._id },
    { readed: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      Notification.find({ user: req.user._id })
        .populate("user", "_id name avatar")
        .populate("sender", "_id name avatar")
        .sort({ createdAt: -1 })
        .limit(9)
        .then((notifications) => {
          res.status(200).json(notifications);
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    }
  );

  // .then((notifications) => {
  //   console.log("2222",notifications)
  //   notifications.map((notification) => (notification.readed = true));

  //   notifications.save()
  //     .then((result) => {
  //       console.log("result:",result)
  //       res.status(200).json(result);
  //     })
  //     .catch((err) => {
  //       res.status(500).json(err);
  //     });
  // })
  // .catch((err) => {
  //   res.status(500).json(err);
  // });
});

module.exports = router;
