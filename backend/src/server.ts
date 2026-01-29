import path from "node:path";
import Fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";
import fastifyStatic from "@fastify/static";
import fastifyCors from "@fastify/cors";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";

import { connectDB } from "./config/database";
import { registerAuthRoutes } from "./routes/authRoutes";
import { registerTaskRoutes } from "./routes/taskRoutes";
import { setAuthHooks } from "./middleware/auth";

dotenv.config();

const app = Fastify({
  logger: true,
});

const PORT = parseInt(process.env.FASTIFY_PORT || "5000", 10);
const HOST = process.env.FASTIFY_HOST || "0.0.0.0";
const SESSION_SECRET =
  process.env.SESSION_SECRET || "your-session-secret-change-in-production";
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/todo_app";

const configurePlugins = async () => {
  // CORS - Allow frontend to connect
  await app.register(fastifyCors, {
    origin: ["https://taskapp-cvmv.onrender.com",
       "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  });

  // Cookie handling
  await app.register(fastifyCookie);

  // Session management with MongoDB store
  await app.register(fastifySession, {
    secret: SESSION_SECRET,
    cookieName: "todo.sid",
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days,
      domain: ".onrender.com", // This allows the cookie to be shared across both subdomains
    },
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
      ttl: 60 * 60 * 24 * 7,
    }),
  });

  // Auth hooks
  setAuthHooks(app);

  // Static files
  await app.register(fastifyStatic, {
    root: path.join(__dirname, "../public"),
    prefix: "/public/",
  });
};

const registerRoutes = async () => {
  // Auth routes
  await app.register(registerAuthRoutes);

  // Task routes
  await app.register(registerTaskRoutes);
};

const start = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Configure plugins
    await configurePlugins();

    // Register routes
    await registerRoutes();

    // Start server
    await app.listen({ port: PORT, host: HOST });
    console.log(`✓ Server running at http://${HOST}:${PORT}`);
  } catch (error) {
    console.error("✗ Server failed to start:", error);
    process.exit(1);
  }
};

start();
