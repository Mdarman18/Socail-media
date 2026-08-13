// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";

// import "dotenv/config";
// import { User } from "../models/user.js";

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: process.env.GOOGLE_CALLBACK_URL,
//     },
//     async (accessToken, refreshToken, profile, cb) => {
//       try {
//         const email = profile.emails[0].value;
//         let user = await User.findOne({ email });

//         if (user) {
//           if (!user.googleId) {
//             user.googleId = profile.id;
//             await user.save();
//           }
//         } else {
//           user = await User.create({
//             googleId: profile.id,
//             username: profile.displayName,
//             email: profile.emails[0].value,
//             img: profile.photos?.[0]?.value || "",
//           });
//         }
//         return cb(null, user);
//       } catch (err) {
//         console.log(process.env.GOOGLE_CALLBACK_UR, L, err);

//         return cb(err, null);
//       }
//     },
//   ),
// );

// export default passport;
