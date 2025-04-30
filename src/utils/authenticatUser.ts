import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";

//This is here incase we leave azure or want to add a layer of authentication

export interface UserPayload {
  id: string;
  email: string;
}
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";


/**
 * Authenticates the user by verifying the JWT token in the Authorization header.
 * Attaches the user to the request object on success.
 * @param request The Fastify request object.
 * @param reply The Fastify reply object.
 * @throws If authentication fails.
 */

export const authenticateUser = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      reply
        .code(401)
        .send({ error: "Missing or invalid Authorization header" });
      return;
    }

    const token = authHeader.substring(7); // Extract the token from the header
    const user = await verifyToken(token); // Verify the token
    (request as any).user = user; // Attach user information to the request object
  } catch (error: any) {
    reply.code(401).send({ error: "Authentication failed: " + error.message });
    return;
  }
};


/**
 * Verifies the JWT token.
 * @param token The JWT token to verify.
 * @returns The decoded user information if the token is valid.
 * @throws If the token is invalid or missing.
 */
const verifyToken = (token: string): Promise<UserPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        reject(err); // Token verification failed
      } else {
        const payload = decoded as any;
        resolve({
          id: payload.id,
          email: payload.email,
        });
      }
    });
  });
};


export async function validateToken(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const token = request.headers.authorization?.split(" ")[1];
  if (!token) {
    reply.code(401).send({ error: "Token is required" });
    return;
  }
  try {

    const userClaims = await verifyToken(token);
    request.user = userClaims; // Optionally attach user claims to the request for further use
  } catch (error) {
    reply.code(401).send({ error: "Invalid token" });
  }
}
