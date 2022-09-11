const mongoose = require("mongoose"); // Erase if already required
const { ObjectId } = mongoose.Schema;
const notificationSchema = new mongoose.Schema(
  {
    user: { type: ObjectId, ref: "User" },
    sender: { type: ObjectId, ref: "User" },
    type: { type: String },
    post: { type: ObjectId, ref: "Post" },
    readed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
//Export the model
module.exports = mongoose.model("Notification", notificationSchema); 
