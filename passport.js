import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "./Models/user.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // First check by googleId
        let user = await User.findOne({ googleId: profile.id });

        // If not found by googleId, check by email (existing manual account)
        if (!user) {
          user = await User.findOne({ email: profile.emails[0].value });
        }

        // If still not found, create new
        if (!user) {
  return done(null, {
    isNewUser: true,
    name: profile.displayName,
    email: profile.emails[0].value,
    googleId: profile.id,
    profileImage: profile.photos[0].value,
  });
}

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));


console.log(process.env.GOOGLE_CLIENT_ID);
console.log(process.env.GOOGLE_CLIENT_SECRET);

export default passport;