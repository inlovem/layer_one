import { ssoService } from '../services/SsoService';
import { jwtService } from '../services/JwtService';
import { FastifyRequest, FastifyReply } from "fastify";
import { installationOrchestrator } from '../services/orchestrators/InstallationOrchestrator';



/**
 * Handles the initial installation of the application by exchanging an authorization code for a token.
 * This is the first step in the OAuth flow.
 * 
 * @param request - The Fastify request object containing the authorization code.
 * @param reply - The Fastify reply object used to send the response.
 * @returns A response indicating success or failure.
 */
export async function exchangeCodeController(
  request: FastifyRequest<{ Body: { code: string } }>,
  reply: FastifyReply
) {
  try {
    const result = await installationOrchestrator.processInstallation(request.body.code);

    return reply.status(201).send({
      success: true,
      companyId: result.companyId,
      redirectUri: process.env.GOHL_REDIRECT_URI,
    });
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({
      success: false,
      error: 'Failed to process installation',
    });
  }
}

/**
 * Validates the SSO token and creates a JWT for the user.
 * 
 * @param request - The Fastify request object containing the SSO token.
 * @param reply - The Fastify reply object used to send the response.
 * @returns A response containing the user data and JWT token.
 * @throws An error if the SSO token decryption fails.
 * @throws An error if the user update fails.
 * @throws An error if the JWT creation fails.
 */
export const validateSsoController = async (
  request: FastifyRequest<{ Body: { ssoToken: string } }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const userData = await ssoService.decryptSSO(request.body.ssoToken);
    if (!userData) {
      throw new Error('Invalid SSO token');
    }
    const jwtToken = jwtService.createJwtForUser(userData);
    reply.header(
      "Set-Cookie",
      `token=${jwtToken}; HttpOnly; Path=/; Secure; SameSite=Strict`
    );
    reply.send({
      status: "success",
      data: userData,
      token: jwtToken,
    });
  } catch (error) {
    console.error("SSO Decryption error:", error);
    return reply.status(401).send({
      error: "Invalid SSO token",
    });
  }
};

