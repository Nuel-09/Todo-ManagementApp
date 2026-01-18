import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { Admin, AdminDocument } from "../models/Admin";

// Extend FastifyRequest to include admin property
declare module "fastify" {
  interface FastifyRequest {
    admin?: AdminDocument | null;
  }
}

// Extend FastifySession to include custom properties
declare module "@fastify/session" {
  interface FastifySessionObject {
    adminId?: string;
    destroy(): void; // or regenerate()
  }
}

export const setAuthHooks = (app: FastifyInstance) => {
  // Load admin data on every request if user is logged in
  app.addHook("preHandler", async (request, reply) => {
    if (request.session.adminId) {
      try {
        request.admin = await Admin.findById(request.session.adminId);
      } catch (error) {
        request.admin = null;
      }
    } else {
      request.admin = null;
    }
  });
};

export const ensureAuthenticated = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  if (!request.session.adminId) {
    return reply.status(401).send({ error: "unauthorised" });
  }
};
