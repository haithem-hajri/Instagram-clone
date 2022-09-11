const express = require("express");
router = express.Router();
const  {requireLogin} = require('../middlware/requireLogin')
const Conversation = require('../models/Conversation')
// router.post("/conversation", requireLogin, async (req, res) => {
//   const newConversation = new Conversation({
//     members: [req.body.senderId, req.body.receiverId],
//   });

//   try {
//     const savedConversation = await newConversation.save();
//     res.status(200).json(savedConversation);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// }); 
router.get("/conversation", requireLogin, async (req, res) => {
 
  try {
    const conversation = await Conversation.find({ 
    $and:([ {members: { $in: [req.user._id] }}, {has_msgs:true}])
    })
      .populate("members", "_id name avatar email isOnline")
      .sort({ updatedAt: -1 });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err); 
  }
});

//export the router object for use in server.js
module.exports = router;
