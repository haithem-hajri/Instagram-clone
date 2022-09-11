const express = require("express");
const router = express.Router();
const NotificationMessages = require("../models/MessageNotfications");
const { requireLogin } = require("../middlware/requireLogin");

router.get("/message-notifications", requireLogin, (req, res) => {
  NotificationMessages.find({
    $and: [{ receiver: req.user._id }, { readed: false }],
  })

    .populate("receiver", "_id name avatar")
    .populate("sender", "_id name avatar")
    //  .select("receiver sender readed ")
    //.sort({ createdAt: -1 })
    .then((notifications) => {
      res.status(200).json(notifications);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});
router.put("/update-message-notifications", requireLogin, (req, res) => {
  NotificationMessages.updateMany(
    { $and: [{ receiver: req.user._id }, { sender: req.body.sender }] },
    { readed: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      NotificationMessages.find({
        $and: [{ receiver: req.user._id }, { readed: false }],
      })
        .populate("receiver", "_id name avatar")
        .populate("sender", "_id name avatar")
        // .select('sender user readed')
        // .sort({ createdAt: -1 })
        .then((notifications) => {
          res.status(200).json(notifications);
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    }
  );
});

module.exports = router;
