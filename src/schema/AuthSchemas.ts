import { FastifySchema } from 'fastify';
import { Type } from '@sinclair/typebox';

// Common Error Responses
export const ERROR400 = Type.Object(
  {
    message: Type.String(),
    statusCode: Type.Literal(400)
  },
  { description: 'Bad Request - Invalid input parameters' }
);

export const ERROR401 = Type.Object(
  {
    message: Type.String(),
    statusCode: Type.Literal(401)
  },
  { description: 'Unauthorized - Authentication required or failed' }
);

export const ERROR403 = Type.Object(
  {
    message: Type.String(),
    statusCode: Type.Literal(403)
  },
  { description: 'Forbidden - Insufficient permissions' }
);

export const ERROR404 = Type.Object(
  {
    message: Type.String(),
    statusCode: Type.Literal(404)
  },
  { description: 'Not Found - Requested resource does not exist' }
);

export const ERROR500 = Type.Object(
  {
    message: Type.String(),
    statusCode: Type.Literal(500)
  },
  { description: 'Server Error - Internal processing error' }
);
// Exchange Code Schema
export const ExchangeCodeSchema: FastifySchema = {
    description: 'Exchange authorization code for access token',
    tags: ['authentication'],
    summary: 'Complete OAuth flow by exchanging code for token',
    
    body: Type.Object({
      code: Type.String({ description: 'The authorization code to exchange' }),
      redirectUri: Type.Optional(Type.String({ 
        description: 'The redirect URI used in the initial request' 
      })),
      state: Type.Optional(Type.String({ 
        description: 'State parameter to verify the request origin' 
      }))
    }),
    
    response: {
      200: Type.Object({
        success: Type.Boolean({ description: 'Indicates if the code exchange was successful' }),
        companyId: Type.String({ description: 'The company identifier' }),
        redirectUri: Type.String({ description: 'The configured redirect URI' })
      }, { description: 'Successful code exchange' }),
      
      500: Type.Object({
        error: Type.String({ description: 'Error message describing what went wrong' })
      }, { description: 'Failed to exchange code for token' }),
      
      400: Type.Object({
        error: Type.String({ description: 'Bad Request' })
      }, { description: 'The request must conatain a code from the GHL Paramaters' }),

      401: ERROR401
    }
  };

// Validate SSO Schema
export const ValidateSsoSchema: FastifySchema = {
  description: 'Validate a single sign-on request',
  tags: ['authentication'],
  summary: 'Verify SSO token and establish user session',
  body: Type.Object({
    ssoToken: Type.String({ description: 'The SSO token to validate' }),
    provider: Type.Optional(Type.String({ description: 'Identity provider name (e.g., "google", "github")' }))
  }),
  response: {
    200: Type.Object({
      valid: Type.Boolean({ description: 'Indicates if the token is valid' }),
      user: Type.Object({
        id: Type.String({ description: 'Unique user identifier' }),
        email: Type.String({ description: 'User email address' }),
        name: Type.Optional(Type.String({ description: 'User full name' })),
        avatarUrl: Type.Optional(Type.String({ description: 'User profile image URL' }))
      }, { description: 'User profile information' }),
      session: Type.Object({
        token: Type.String({ description: 'Session token for subsequent requests' }),
        expiresAt: Type.Number({ description: 'Session expiration timestamp' })
      }, { description: 'Session information' })
    }, { description: 'Successful SSO validation' }),
    
    400: ERROR400,
    401: ERROR401,
    500: ERROR500
  }
};

// Refresh Token Schema
export const RefreshTokenSchema: FastifySchema = {
  description: 'Refresh an expired access token',
  tags: ['authentication'],
  summary: 'Get a new access token using refresh token',
  
  body: Type.Object({
    refreshToken: Type.String({ description: 'The refresh token obtained during authentication' })
  }),
  
  response: {
    200: Type.Object({
      accessToken: Type.String({ description: 'New JWT access token' }),
      tokenType: Type.String({ description: 'Type of token, usually "Bearer"' }),
      expiresIn: Type.Number({ description: 'Token expiration time in seconds' })
    }, { description: 'Successfully refreshed token' }),
    
    400: ERROR400,
    401: ERROR401,
    500: ERROR500
  }
};

// Logout Schema
export const LogoutSchema: FastifySchema = {
  description: 'Invalidate user session and tokens',
  tags: ['authentication'],
  summary: 'Log out the current user',
  
  headers: Type.Object({
    authorization: Type.String({ description: 'Bearer token for authentication' })
  }),
  
  response: {
    200: Type.Object({
      success: Type.Boolean({ description: 'Indicates if logout was successful' }),
      message: Type.String({ description: 'Status message' })
    }, { description: 'Successfully logged out' }),
    
    401: ERROR401,
    500: ERROR500
  }
};