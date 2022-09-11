const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const PostSchema = new mongoose.Schema(
  {
    title: { type: String },
    photo: { type: String, required: true }, 
    likes: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        text: String,
        postedby: { type: ObjectId, ref: "User" },
      },
    ],
    postedby: { type: ObjectId, ref: "User" },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Post", PostSchema);
