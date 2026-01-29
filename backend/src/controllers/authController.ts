import { FastifyRequest, FastifyReply } from "fastify";
import bcryptjs from "bcryptjs";
import { User } from "../models/user";
import { handleSuccess, handleError } from "./baseController";
import { signJwt, verifyJwt } from "../utils/jwt"; // JWT PATCH

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
        

        // JWT PATCH: Issue JWT
        const token = signJwt({ userId: newUser._id });

        // Return user data and JWT
        return handleSuccess(reply, {
          _id: newUser._id,
          email: newUser.email,
          name: newUser.name,
          token, // JWT PATCH
        }, 201);
    } catch (error) {
          return handleError(reply, error);
  }
}

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


    // JWT PATCH: Issue JWT
    const token = signJwt({ userId: user._id });

    // Return user data and JWT
    return handleSuccess(
      reply,
      {
        _id: user._id,
        email: user.email,
        name: user.name,
        token, // JWT PATCH
      }
    );
  } catch (error) {
    return handleError(reply, error);
  }
};

// LOGOUT - End session
export const logout = async (request: FastifyRequest, reply: FastifyReply) => {
  // JWT PATCH: No-op for JWT logout (client just deletes token)
  return handleSuccess(reply, { message: "Logged out successfully" });
}

  // GET PROFILE - Get current user
export const getProfile = async (request: FastifyRequest, reply: FastifyReply) => {
  // JWT PATCH: Get token from Authorization header
  try {
    const auth = request.headers["authorization"];
    if (!auth || !auth.startsWith("Bearer ")) {
      return handleError(reply, { message: "Not authenticated" }, 401);
    }
    const token = auth.split(" ")[1];
    const payload = verifyJwt(token);
    if (!payload || typeof payload !== "object" || !payload.userId) {
      return handleError(reply, { message: "Not authenticated" }, 401);
    }
    const user = await User.findById(payload.userId).select("-password");
    if (!user) {
      return handleError(reply, { message: "User not found" }, 404);
    }
    return handleSuccess(reply, user);
  } catch (error) {
    return handleError(reply, error);
  }
};