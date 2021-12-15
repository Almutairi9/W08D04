const express = require("express");
const passport = require("passport");
const popupTools = require("popup-tools");

require("./../../configuration/passport");
const {
  signup,
  login,
  getUsers,
  deleteUser,
  verifyAccount,
  verifyEmail,
  resetPassword,
} = require("./../controller/user");
const authentication = require("./../Middelware/Authentication");
const authorization = require("./../Middelware/Authorization");

const userRouter = express.Router();

userRouter.post("/signup", signup);

userRouter.post("/verify_account", verifyAccount);
userRouter.post("/check_email", verifyEmail);
userRouter.post("/reset_password", resetPassword);
userRouter.post("/login", login);
userRouter.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
  );
  userRouter.get(
    "/auth/google/callback",
    passport.authenticate("google"),
    (req, res) => {
      res.end(popupTools.popupResponse(req.user));
    }
  );
// Admin .....
userRouter.get("/user", authentication, authorization, getUsers);
userRouter.delete("/user/:id", authentication, authorization, deleteUser);

module.exports = userRouter;