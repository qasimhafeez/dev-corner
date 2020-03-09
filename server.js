const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB config
const db = require("./config/keys").mongoURI;
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Mongodb Connected!"))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());
require("./config/passport")(passport);

// Routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

// Check for production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}.`));
