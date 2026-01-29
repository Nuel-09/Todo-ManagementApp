import mongoose, {Schema, Document} from "mongoose";

// define the task document
export interface ITaskDocument extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    status: "pending" | "completed" | "deleted";
    priority?: "low" | "medium" | "high";
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// define the schema
const taskSchema = new Schema<ITaskDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "deleted"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: {
      type: Date,
    },
  },
  {
    timestamps: true, // Auto-adds createdAt and updatedAt
  }
);

// Create and export the model
export const Task = mongoose.model<ITaskDocument>("Task", taskSchema);