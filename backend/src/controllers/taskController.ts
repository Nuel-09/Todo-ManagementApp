import { FastifyRequest, FastifyReply } from "fastify";
import { Task } from "../models/Task";
import { handleSuccess, handleError } from "./baseController";

// CREATE - Add new task
export const createTask = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { title, description, priority, dueDate } = request.body as {
      title: string;
      description?: string;
      priority?: "low" | "medium" | "high";
      dueDate?: string;
    };

    // Validate input
    if (!title) {
      return handleError(reply, { message: "Title is required" }, 400);
    }

    // Check if user is authenticated
    if (!request.session.userId) {
      return handleError(reply, { message: "Not authenticated" }, 401);
    }

    // Create task
    const newTask = await Task.create({
      userId: request.session.userId,
      title,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      status: "pending",
    });

    return handleSuccess(reply, newTask, 201);
  } catch (error) {
    return handleError(reply, error);
  }
};

// GET ALL - Get user's tasks (with filtering)
export const getTasks = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    // Check if user is authenticated
    if (!request.session.userId) {
      return handleError(reply, { message: "Not authenticated" }, 401);
    }

    // Get query parameters for filtering
    const { status } = request.query as { status?: string };

    // Build filter
    const filter: any = { userId: request.session.userId };
    if (status) {
      filter.status = status; // Filter by status if provided
    }

    // Fetch tasks
    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    return handleSuccess(reply, tasks);
  } catch (error) {
    return handleError(reply, error);
  }
};

// GET ONE - Get specific task
export const getTask = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };

    // Check if user is authenticated
    if (!request.session.userId) {
      return handleError(reply, { message: "Not authenticated" }, 401);
    }

    // Find task
    const task = await Task.findById(id);

    // Check if task exists
    if (!task) {
      return handleError(reply, { message: "Task not found" }, 404);
    }

    // Check if user owns this task
    if (task.userId.toString() !== request.session.userId) {
      return handleError(reply, { message: "Not authorized" }, 403);
    }

    return handleSuccess(reply, task);
  } catch (error) {
    return handleError(reply, error);
  }
};

// UPDATE - Update task
export const updateTask = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params as { id: string };
    const { title, description, status, priority, dueDate } = request.body as {
      title?: string;
      description?: string;
      status?: "pending" | "completed" | "deleted";
      priority?: "low" | "medium" | "high";
      dueDate?: string;
    };

    // Check if user is authenticated
    if (!request.session.userId) {
      return handleError(reply, { message: "Not authenticated" }, 401);
    }

    // Find task
    const task = await Task.findById(id);

    // Check if task exists
    if (!task) {
      return handleError(reply, { message: "Task not found" }, 404);
    }

    // Check if user owns this task
    if (task.userId.toString() !== request.session.userId) {
      return handleError(reply, { message: "Not authorized" }, 403);
    }

    // Update fields
    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = new Date(dueDate);

    // Save changes
    const updatedTask = await task.save();

    return handleSuccess(reply, updatedTask);
  } catch (error) {
    return handleError(reply, error);
  }
};

// DELETE - Delete task
export const deleteTask = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params as { id: string };

    // Check if user is authenticated
    if (!request.session.userId) {
      return handleError(reply, { message: "Not authenticated" }, 401);
    }

    // Find task
    const task = await Task.findById(id);

    // Check if task exists
    if (!task) {
      return handleError(reply, { message: "Task not found" }, 404);
    }

    // Check if user owns this task
    if (task.userId.toString() !== request.session.userId) {
      return handleError(reply, { message: "Not authorized" }, 403);
    }

    // Delete task
    await Task.findByIdAndDelete(id);

    return handleSuccess(reply, { message: "Task deleted successfully" });
  } catch (error) {
    return handleError(reply, error);
  }
};
