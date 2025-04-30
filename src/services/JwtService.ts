
import jwt from 'jsonwebtoken';

// JWT Service
export const jwtService = {
    /**
     * Creates a JWT for the user.
     */
    createJwtForUser(userData: any): string {
      const JWT_SECRET = process.env.JWT_SECRET || '';
      const payload = {
        id: userData.userId,
        email: userData.email,
        role: userData.role,
        locationId: userData.locationId,
      };
      return jwt.sign(payload, JWT_SECRET, { expiresIn: '100h' });
    }
  };
  