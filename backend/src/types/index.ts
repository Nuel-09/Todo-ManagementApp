import { ObjectId } from "mongodb";

// User
export interface IUser {
  _id?: ObjectId;
  email: string;
  password: string; // hashed
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Todo Item
export interface ITask {
  _id?: ObjectId;
  userId: ObjectId; // FK to User
  title: string;
  description?: string;
  status: "pending" | "completed" | "deleted";
  priority?: "low" | "medium" | "high";
  dueDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// API Response Types
// export interface   IUserResponse extends Omit<IUser, 'password'> {
//   _id: string;
// }

// export interface ITaskResponse extends ITodo {
//   _id: string;
//   userId: string;
// }
