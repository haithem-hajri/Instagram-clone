const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Notification = require("../models/Notification");
router.post("/signup", (req, res) => {
  const { name, email, password, avatar } = req.body;
  if (!name || !email || !password) {
    res.status(422).json({ error: "please add all the fields" });
  }
  User.findOne({ email: email })
    .then((saveduser) => {
      if (saveduser) {
        return res.status(422).json({ email: "user is already exist" });
      }
      bcrypt
        .hash(password, 12)
        .then((hashp) => {
          const user = new User({
            name,
            email,
            password: hashp,
            avatar: avatar,
          });
          user.save();
        })

        .then((user) => {
          res.status(200).json({ message: "register succesfully" });
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});
router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(422).json({ error: "please add all the fields" });
  }
  User.findOne({ email: email }).then((saveduser) => {
    if (!saveduser) {
      return res.status(422).json({ email: "invalid email" });
    }
    bcrypt
      .compare(password, saveduser.password)
      .then((doMatch) => {
        if (doMatch) {
          jwt.sign(
            { _id: saveduser._id },
            process.env.JWT_SECRET,
            (err, token) => {
              if (err) throw err;
              const { _id, name, email, followers, following, avatar } =
                saveduser;
              res.json({
                token: "Bearer " + token,
                user: {
                  _id,
                  name,
                  email,
                  followers,
                  following,
                  avatar,
                },
                notifications: [],
              });
            }
          );
          // Notification.find({ user: saveduser._id })
          //   .populate("user", "_id name avatar")
          //   .populate("sender", "_id name avatar")
          //   .sort({ createdAt: -1 })
          //   .limit(9)
          //   .then((result) => {
          //     const { _id, name, email, followers, following, avatar } =
          //       saveduser;
          //     res.json({
          //       token: "Bearer " + token,
          //       user: {
          //         _id,
          //         name,
          //         email,
          //         followers,
          //         following,
          //         avatar,
          //       },
          //       notifications: result,
          //     });
          //   })
          //   .catch((err) => {
          //     res.status(500).json(err);
          //   });
        }
        //{res.json('succesfully sign in')}
        else {
          return res.status(422).json({ password: "invalid password " });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

module.exports = router;
