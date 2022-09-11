const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");
const config = require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const auth = require("./routes/auth");
const post = require("./routes/post");
const user = require("./routes/user");
const notification = require("./routes/notifications");
const conversations = require("./routes/conversations");
const notificationMessage = require("./routes/messageNotifications");
const messages = require("./routes/messages");
const http = require("http");
const socketIo = require("socket.io");
const User = require("./models/User");
//console.log("first",process.env.MONGO_URI) 
mongoose.connect(
  "mongodb+srv://insta:99256188@insta.uhtc9ra.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    // useCreateIndex: true,
  },
  (err) => {
    if (!err) {
      console.log("MongoDB Connection Succeeded.");
    } else {
      console.log("Error in DB connection: " + err);
    }
  }
);
/* -------------------------------------------------------------------------- */
/*                                SOCKET SERVER                               */
/* -------------------------------------------------------------------------- */
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
  },
}); //in case server and client run on different urls
io.on("connection", (socket) => {
  socket.on("connect_user", (userId) => {
    var c = User.findByIdAndUpdate(
      userId,
      { socketId: socket.id, isOnline: true },
      function (err, result) {
        if (err) {
          console.log(err);
        } else {
          // console.log("res:", result);
        }
      }
    );
    User.find()
      .select("-password")
      .then(function (users) {
        io.emit("users", users);
      });
  });

  socket.on("disconnect", () => {
    var c = User.findOne({ socketId: socket.id })
      .then((user) => {
        if (user) {
          user.isOnline = false;
          user.save().then((result) => {
            User.find()
              .select("-password")
              .then(function (users) {
                io.emit("users", users);
              })
              .catch((err) => {
                console.log(err);
              });
          });
        }
      })
      .catch((err) => {
        console.log("err:", err);
      });
  });
});
/*************************************************************/
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.set("socketio", io);
//routes
app.use("/api", auth);
app.use("/api", post);
app.use("/api", user);
app.use("/api", notification);
app.use("/api", conversations);
app.use("/api", messages);
app.use("/api", notificationMessage);

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

/* -------------------------------------------------------------------------- */
/*                               CONNECT SERVER                               */
/* -------------------------------------------------------------------------- */
server.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log("Server running on- Port ", PORT);
});
