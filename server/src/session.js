import dotenv from "dotenv";
import session from "express-session";
import pgSession from "connect-pg-simple";
import db from "./db.js";

dotenv.config();

const PGStore = pgSession(session);

const isProduction = process.env.NODE_ENV === "production";

export default session({
  store: new PGStore({
    pool: db.pool,
    tableName: "sessions",
    createTableIfMissing: false,
  }),
  name: isProduction ? "__Host-centeric.sid" : "centeric.sid",
  secret: process.env.SESSION_SECRET || "centeric-session-secret-change-in-production",
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
  },
});
