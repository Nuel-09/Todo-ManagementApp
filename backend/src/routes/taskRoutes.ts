import { FastifyInstance } from "fastify";
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController";
import { ensureAuthenticated } from "../middleware/auth";

export const registerTaskRoutes = async (app: FastifyInstance) => {
  // All task routes require authentication

  // CREATE - Add new task
  app.post("/api/tasks", { preHandler: ensureAuthenticated }, createTask);

  // GET ALL - Get user's tasks (with optional filtering)
  app.get("/api/tasks", { preHandler: ensureAuthenticated }, getTasks);

  // GET ONE - Get specific task
  app.get("/api/tasks/:id", { preHandler: ensureAuthenticated }, getTask);

  // UPDATE - Update task
  app.put("/api/tasks/:id", { preHandler: ensureAuthenticated }, updateTask);

  // DELETE - Delete task
  app.delete("/api/tasks/:id", { preHandler: ensureAuthenticated }, deleteTask);
};
