import { FastifyRequest, FastifyReply } from "fastify";
import bcryptjs from "bcryptjs";
import { User } from "../models/user";
import { handleSuccess, handleError } from "./baseController";

// SIGNUP - Create new user account

export const signup = async (
    request: FastifyRequest,
     reply: FastifyReply
) => {
    try {
        const { email, password, name } = request.body as {
            email: string;
            password: string;
            name: string;
        };

        //validate input
        if (!email || !password || !name) {
            return handleError(reply, {message: "Fill in all fields"}, 400);
        }

        // check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return handleError (reply, {message: "Email already exist"}, 400);
        }

        // Hash password
        const hashedPassword = await bcryptjs.hash(password, 10);


        // Create new user
        const newUser = await User.create({
            email: email.toLowerCase(),
            password: hashedPassword,
            name,
        });
        
        // Store user ID in session
        request.session.userId = newUser._id.toString();

        // Return user data (without password)
        return handleSuccess(reply, {
            _id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        }, 201);
    } catch (error) {
          return handleError(reply, error);
  }
};

// Login - Authenticate user
export const login = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    //validate input
    if (!email || !password) {
      return handleError(reply, { message: "Email and password are required" }, 400);
    }

    // find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return handleError(reply, { message: "invalid email or password" }, 401);
    }

    // Compare passwords
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
        return handleError(reply, { message : "invalid email or password"})
    }

    // Store user ID in session
    request.session.userId = user._id.toString();

    // Return user data (without password)
    return handleSuccess(
      reply,
      {
        _id: user._id,
        email: user.email,
        name: user.name,
      }
    );
  } catch (error) {
    return handleError(reply, error);
  }
};

// LOGOUT - End session
export const logout = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    // Destroy session
    await request.session.destroy();

    return handleSuccess(reply, { message: "Logged out successfully" });
  } catch (error) {
    return handleError(reply, error);
  }};

  // GET PROFILE - Get current user
export const getProfile = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    if (!request.session.userId) {
      return handleError(reply, { message: "Not authenticated" }, 401);
    }

    const user = await User.findById(request.session.userId).select("-password");
    if (!user) {
      return handleError(reply, { message: "User not found" }, 404);
    }

    return handleSuccess(reply, user);
  } catch (error) {
    return handleError(reply, error);
  }
};