const usersModel = require("./../db/models/user");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { request } = require("express");

dotenv.config();

const SECRET = process.env.SECRET;

const GOOGLE_CLIENT_ID = "382674890446-9oea91a7inhc4dmk94nt100e8matic5u.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET = "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"

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      console.log(profile);
      const email = profile.emails[0].value.toLowerCase();
      const userName = profile.name.givenName.toLowerCase();

      const user = await usersModel
        .findOne({
          $or: [{ userName }, { email }],
        })
        .populate("role");
      if (user) {
        const payload = {
          id: user._id,
          email: user.email,
          role: user.role.role,
          userName: user.userName,
          deleted: user.deleted,
        };

        const options = {
          expiresIn: "4h",
        };
        const token = jwt.sign(payload, "SECRET", options);
        return done(null, { result: user, token });
      } else {
        const newUser = new usersModel({
          email: email,
          userName: userName,
          pic: profile.pic, 
          role: "61b1ed947473faeb6bb570dd", 
          active: true,
        });
        newUser.save().then(async (result) => {
          console.log(result)
          const res = await usersModel
            .findOne({ _id: result._id })
            .populate("role");

          const payload = {
            id: res._id,
            email: res.email,
            role: res.role.role,
            userName: res.userName,
            deleted: res.deleted,
          };

          const options = {
            expiresIn: "4h",
          };
          const token = jwt.sign(payload, "SECRET", options);
          return done(null, { result: res, token });
        });
      }
      //  return done(null, profile );
    } 
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
