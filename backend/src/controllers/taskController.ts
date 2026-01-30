import { FastifyRequest, FastifyReply } from "fastify";
import { Task } from "../models/Task";
import { handleSuccess, handleError } from "./baseController";
import { verifyJwt } from "../utils/jwt";

function getUserIdFromAuth(request: FastifyRequest): string | null {
  const auth = (request as any).headers["authorization"];
  if (!auth || !auth.startsWith("Bearer ")) return null;
  const token = auth.split(" ")[1];
  const payload = verifyJwt(token);
  if (!payload || typeof payload !== "object" || !payload.userId) return null;
  return payload.userId;
}

// CREATE - Add new task
export const createTask = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { title, description, priority, dueDate } = (request as any).body as {
      title: string;
      description?: string;
      priority?: "low" | "medium" | "high";
      dueDate?: string;
    };

    // Validate input
    if (!title || typeof title !== "string" || !title.trim()) {
      return handleError(
        reply,
        { message: "Task title is required and cannot be empty." },
        400
      );
    }
    if (title.length > 100) {
      return handleError(
        reply,
        { message: "Task title must be less than 100 characters." },
        400
      );
    }
    if (description && description.length > 500) {
      return handleError(
        reply,
        { message: "Description must be less than 500 characters." },
        400
      );
    }
    if (priority && !["low", "medium", "high"].includes(priority)) {
      return handleError(
        reply,
        { message: "Priority must be 'low', 'medium', or 'high'." },
        400
      );
    }
    if (dueDate && isNaN(Date.parse(dueDate))) {
      return handleError(reply, { message: "Due date is invalid." }, 400);
    }

    // JWT PATCH: Get userId from JWT
    const userId = getUserIdFromAuth(request);
    if (!userId) {
      return handleError(
        reply,
        { message: "You must be logged in to create a task." },
        401
      );
    }
    // Create task
    const newTask = await Task.create({
      userId,
      title: title.trim(),
      description: description?.trim(),
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      status: "pending",
    });

    return handleSuccess(reply, newTask, 201);
  } catch (error: any) {
    return handleError(
      reply,
      { message: error?.message || "Failed to create task. Please try again." },
      500
    );
  }
};

// GET ALL - Get user's tasks (with filtering)
export const getTasks = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const userId = getUserIdFromAuth(request);
    if (!userId) {
      return handleError(
        reply,
        { message: "You must be logged in to view your tasks." },
        401
      );
    }
    // Get query parameters for filtering
    const { status } = (request as any).query as { status?: string };
    // Build filter
    const filter: any = { userId };
    if (status) {
      filter.status = status;
    }
    // Fetch tasks
    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    return handleSuccess(reply, tasks);
  } catch (error: any) {
    return handleError(
      reply,
      { message: error?.message || "Failed to fetch tasks. Please try again." },
      500
    );
  }
};

// GET ONE - Get specific task
export const getTask = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = (request as any).params as { id: string };

    const userId = getUserIdFromAuth(request);
    if (!userId) {
      return handleError(
        reply,
        { message: "You must be logged in to view this task." },
        401
      );
    }
    // Find task
    const task = await Task.findById(id);
    if (!task) {
      return handleError(
        reply,
        {
          message: "Task not found. It may have been deleted or never existed.",
        },
        404
      );
    }
    if (task.userId.toString() !== userId) {
      return handleError(
        reply,
        { message: "You are not authorized to view this task." },
        403
      );
    }

    return handleSuccess(reply, task);
  } catch (error: any) {
    return handleError(
      reply,
      { message: error?.message || "Failed to fetch task. Please try again." },
      500
    );
  }
};

// UPDATE - Update task
export const updateTask = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id } = (request as any).params as { id: string };
    const { title, description, status, priority, dueDate } = (request as any)
      .body as {
      title?: string;
      description?: string;
      status?: "pending" | "completed" | "deleted";
      priority?: "low" | "medium" | "high";
      dueDate?: string;
    };

    const userId = getUserIdFromAuth(request);
    if (!userId) {
      return handleError(
        reply,
        { message: "You must be logged in to update a task." },
        401
      );
    }
    // Find task
    const task = await Task.findById(id);
    if (!task) {
      return handleError(
        reply,
        {
          message: "Task not found. It may have been deleted or never existed.",
        },
        404
      );
    }
    if (task.userId.toString() !== userId) {
      return handleError(
        reply,
        { message: "You are not authorized to update this task." },
        403
      );
    }

    // Update fields
    if (title !== undefined) {
      if (!title.trim()) {
        return handleError(
          reply,
          { message: "Task title cannot be empty." },
          400
        );
      }
      if (title.length > 100) {
        return handleError(
          reply,
          { message: "Task title must be less than 100 characters." },
          400
        );
      }
      task.title = title.trim();
    }
    if (description !== undefined) {
      if (description.length > 500) {
        return handleError(
          reply,
          { message: "Description must be less than 500 characters." },
          400
        );
      }
      task.description = description.trim();
    }
    if (status !== undefined) {
      if (!["pending", "completed", "deleted"].includes(status)) {
        return handleError(
          reply,
          { message: "Status must be 'pending', 'completed', or 'deleted'." },
          400
        );
      }
      task.status = status;
    }
    if (priority !== undefined) {
      if (!["low", "medium", "high"].includes(priority)) {
        return handleError(
          reply,
          { message: "Priority must be 'low', 'medium', or 'high'." },
          400
        );
      }
      task.priority = priority;
    }
    if (dueDate !== undefined) {
      if (dueDate && isNaN(Date.parse(dueDate))) {
        return handleError(reply, { message: "Due date is invalid." }, 400);
      }
      task.dueDate = dueDate ? new Date(dueDate) : undefined;
    }

    // Save changes
    const updatedTask = await task.save();

    return handleSuccess(reply, updatedTask);
  } catch (error: any) {
    return handleError(
      reply,
      { message: error?.message || "Failed to update task. Please try again." },
      500
    );
  }
};

// DELETE - Delete task
export const deleteTask = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id } = (request as any).params as { id: string };

    const userId = getUserIdFromAuth(request);
    if (!userId) {
      return handleError(
        reply,
        { message: "You must be logged in to delete a task." },
        401
      );
    }
    // Find task
    const task = await Task.findById(id);
    if (!task) {
      return handleError(
        reply,
        {
          message: "Task not found. It may have been deleted or never existed.",
        },
        404
      );
    }
    if (task.userId.toString() !== userId) {
      return handleError(
        reply,
        { message: "You are not authorized to delete this task." },
        403
      );
    }

    // Delete task
    await Task.findByIdAndDelete(id);

    return handleSuccess(reply, { message: "Task deleted successfully." });
  } catch (error: any) {
    return handleError(
      reply,
      { message: error?.message || "Failed to delete task. Please try again." },
      500
    );
  }
};
