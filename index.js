// const cookieSession = require("cookie-session");
const express = require("express");
const passport = require("passport");
const app = express();
const cors = require("cors");
const session = require("express-session");
const db = require("./db/db");
require("./passport");
require("./configuration/passport");
require("dotenv").config();

// app.use(
//   cookieSession({ name :"session" , keys: ["rawan", "rawan2"], maxAge: 24 * 60 *60 *100})
// );

// app.use(
//   cookieSession({
//     name: "session",
//     keys: ["rawan", "rawan2"], 
//   })
// );
app.use(
  session({ secret: process.env.SECRET, resave: false, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(express.json());

const rolesRouter = require("./routers/routes/role");
app.use(rolesRouter);

// const authRoute = require("./routers/routes/auth");
// app.use(authRoute);

const usersRouter = require("./routers/routes/user");
app.use(usersRouter);

const postsRouter = require("./routers/routes/post");
app.use(postsRouter);

const commentsRouter = require("./routers/routes/comment");
app.use(commentsRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
