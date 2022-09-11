const express = require("express");
router = express.Router();
const { requireLogin } = require("../middlware/requireLogin");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const MessageNotifications = require("../models/MessageNotfications");
const User = require("../models/User");
//add message
/* -------------------------------------------------------------------------- */
/*                                SEND_MESSAGES                               */
/* -------------------------------------------------------------------------- */
router.post("/message/:receiverId", requireLogin, (req, res) => {
  var io = req.app.get("socketio");
  Conversation.findOne({
    $and: [
      { members: { $in: req.params.receiverId } },
      { members: { $in: req.user._id } },
    ],
  })

    .then((conver) => {
      if (conver) {
        // if there a conversation and old messages between user and receiver then create message
        if (conver.has_msgs === true) {
          const newMessage = new Message({
            conversationId: conver._id,
            sender: req.user._id,
            text: req.body.text,
          });
          newMessage
            .save()
            .then((result) => {
              res.status(200).json({ message: result });
              conver.updatedAt = Date.now();
              conver.save();
              User.findOne({ _id: req.params.receiverId }).exec(function (
                err,
                res
              ) {
                if (res != null) {
                  io.to(res.socketId).emit("message", result);
                  //create notification and send it to receiver
                  const notification = new MessageNotifications({
                    receiver: req.params.receiverId,
                    sender: req.user._id,
                    type: "message",
                  });
                  notification.save(function (err, notification) {
                    notification.populate("sender", "_id name avatar");
                    notification
                      .populate("receiver", "_id name avatar")
                      .then(function (notifcationResult) {
                        io.to(res.socketId).emit("messageNotification", {
                          notifcationResult,
                        });
                      });
                  });
                  //********************************/
                }
              });
            })
            .catch((err) => {
              res.status(500).json(err);
            });
        } else {
          // if new message in conversation between user and receiver then update has_msgs to true and create new message
          const newMessage = new Message({
            conversationId: conver._id,
            sender: req.user._id,
            text: req.body.text,
          });
          newMessage
            .save()
            .then((result) => {
              res.status(200).json({ message: result });
              conver.has_msgs = true;
              conver.updatedAt = Date.now(); 
              conver.save();
              User.findOne({ _id: req.params.receiverId }).exec(function (
                err,
                res
              ) {
                if (res != null) {
                  io.to(res.socketId).emit("message", result);
                   //create notification and send it to receiver
                   const notification = new MessageNotifications({
                    receiver: req.params.receiverId,
                    sender: req.user._id,
                    type: "message",
                  });
                  notification.save(function (err, notification) {
                    notification.populate("sender", "_id name avatar");
                    notification
                      .populate("receiver", "_id name avatar")
                      .then(function (notifcationResult) {
                        io.to(res.socketId).emit("messageNotification", {
                          notifcationResult,
                        });
                      });
                  });
                  //********************************/
                }
              });
            })
            .catch((err) => {
              res.status(500).json(err);
            });
        }
      } else {
        res.json("no conversation betwenn user and friend");
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});
/* -------------------------------------------------------------------------- */
/*                   GET_MESSAGES_OR_CREATE_NEW_CONVERSATION                  */
/* -------------------------------------------------------------------------- */
router.get("/message/:receiverId", requireLogin, (req, res) => {
  Conversation.findOne({
    $and: [
      { members: { $in: req.params.receiverId } },
      { members: { $in: req.user._id } },
    ],
  })
    .populate("members", "_id name avatar email isOnline")
    .then((conversation) => {
      if (conversation) {
        if (conversation.has_msgs === true) {
          // fetch all messages between user and receiver
          Message.find({ conversationId: conversation._id })
            .then((result) => {
              res.status(200).json({ messages: result });
            })
            .catch((err) => {
              res.status(500).json(err);
            });
        } else {
          // if there is a conversation between user and receiver with no messages ! return conversation
          res.status(200).json({ conversation: conversation });
        }
      } else {
        //if  no conversation then create new conversation
        const newConversation = new Conversation({
          members: [req.user._id, req.params.receiverId],
        });
        newConversation.save(function (err, conversation) {
          conversation
            .populate("members", "_id name avatar email isOnline")
            .then((savedConversation) => {
              res.status(200).json({
                conversation: savedConversation,
              });
            });
        });
      }
    });
});

module.exports = router;
