import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { prisma } from "./db.js";

// ==================== FIND OR MERGE USER ====================
const findOrMergeUser = async ({ provider, providerId, email, name }) => {
  const providerField = provider === "google" ? "googleId" : "facebookId";

  // already linked with this provider
  let user = await prisma.user.findFirst({ where: { [providerField]: providerId } });
  if (user) return user;

  // email exists from a different signup method -> merge accounts
  user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    return prisma.user.update({
      where: { id: user.id },
      data: { [providerField]: providerId, isEmailVerified: true },
    });
  }

  // brand new user
  return prisma.user.create({
    data: {
      email,
      name,
      [providerField]: providerId,
      isEmailVerified: true,
    },
  });
};

// ==================== GOOGLE STRATEGY ====================
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await findOrMergeUser({
          provider: "google",
          providerId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
        });
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// ==================== FACEBOOK STRATEGY ====================
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "/api/auth/facebook/callback",
      profileFields: ["id", "displayName", "emails"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || `fb_${profile.id}@no-email.facebook.com`;

        const user = await findOrMergeUser({
          provider: "facebook",
          providerId: profile.id,
          email,
          name: profile.displayName,
        });
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

export default passport;