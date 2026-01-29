import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { User } from "../models/user";
import { IUserDocument } from "../models/user";

// Extend FastifyRequest to include user property
declare module "fastify" {
  interface FastifyRequest {
    user?: IUserDocument | null;
  }
}

// Extend FastifySession to include custom properties
declare module "@fastify/session" {
  interface FastifySessionObject {
    userId?: string;
    destroy(): void; // or regenerate()
  }
}

export const setAuthHooks = (app: FastifyInstance) => {
  app.addHook("preHandler", async (request, reply) => {
    if (request.session.userId) {
      try {
        request.user = await User.findById(request.session.userId);
      } catch (error) {
        request.user = null;
      }
    } else {
      request.user = null;
    }
  });
};

export const ensureAuthenticated = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  if (!request.session.userId) {
    return reply.status(401).send({ error: "Unauthorized" });
  }
};
