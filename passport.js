var GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require("passport");

const GOOGLE_CLIENT_ID = "382674890446-9oea91a7inhc4dmk94nt100e8matic5u.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET = "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"

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  ///// Sessions Function 
  function(accessToken, refreshToken, profile, Done) {
      Done(null,profile) 
    //   const user = { // for mongoDB 
    //       userName : profile.displayName,
    //       pic : profile.photos[0],
    //   };
    //   user.save(); 
  }
)) 

passport.serializeUser((user,Done)=>{
    Done(null,user) 
})

passport.deserializeUser((user,Done)=>{
    Done(null,user) 
})