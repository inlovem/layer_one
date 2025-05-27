import axios from 'axios';
import { AuthRes } from "../types/types";
import { tokenRepos } from '../repositories/TokenRepos';
import { locationService } from './LocationService';
import { TokenData } from '../types/tokenTypes';




// Token Service
export const tokenService = {
  /**
   * Retrieves a token from GHL, either for a Location or Company.
   /**
   * Retrieves a token from GHL, either for a Location or Company.
   * 
   * @param grant_type - The type of grant to use (authorization_code or refresh_token)
   * @param code - The authorization code (used with authorization_code grant type)
   * @param auth_res - Optional auth response data for refresh tokens
   * @param auth_token - The auth token for location token requests
   * @returns A promise that resolves to the GHL token response data
   * @throws Error if token exchange fails or returns invalid data
   */
  async getGHLToken(
    grant_type: string,
    code?: string, 
    auth_res?: Partial<AuthRes>,
    auth_token?: string
  ): Promise<TokenData> {


    const isLocationToken = Boolean(
      auth_res?.userType === 'Location' && 
      auth_res.locationId && 
      auth_res.companyId
    );
    
    const options = isLocationToken 
      ? this.buildLocationTokenRequest(auth_res!.companyId!, auth_res!.locationId!, auth_token!)
      : this.buildAgencyTokenRequest(grant_type, code, auth_res);

    try {
      const { data } = await axios.request<any>(options);
      if (!data || !data.access_token || !data.companyId) {
        throw new Error('Invalid token data received from GHL');
      }
      
      await tokenRepos.updateAccessToken(data);

      if (!isLocationToken) {
        await locationService.getLocations(data.access_token, data.companyId, process.env.GOHL_APP_ID!);
      }

      return data as TokenData;

    } catch (err: any) {
      this.logTokenError(err, isLocationToken);
      throw err;
    }
  },

  /**
   * Builds the request configuration for location token requests.
   * 
   * @param companyId - The company ID
   * @param locationId - The location ID
   * @param authToken - The authorization token
   * @returns The axios request configuration
   */
  buildLocationTokenRequest(companyId: string, locationId: string, authToken: string) {
    const params = new URLSearchParams();
    params.set('companyId', companyId);
    params.set('locationId', locationId);

    return {
      method: 'POST',
      url: 'https://services.leadconnectorhq.com/oauth/locationToken',
      headers: {
        Authorization: `Bearer ${authToken}`,
        Version: '2021-07-28',
        'Content-Type': 'application/x-www-form-urlencoded',   // body matches header
        Accept: 'application/json',
      },
      data: params                                             // ★ URL-encoded, not JSON
    };
  },

  /**
   * Builds the request configuration for agency/company token requests.
   * 
   * @param grant_type - The type of grant (authorization_code or refresh_token)
   * @param code - The authorization code (for authorization_code grant)
   * @param auth_res - Auth response data (for refresh_token grant)
   * @returns The axios request configuration
   */
  buildAgencyTokenRequest(grant_type: string, code?: string, auth_res?: Partial<AuthRes>) {
    const params = new URLSearchParams();
    params.append('client_id', process.env.GOHL_CLIENT_ID!);
    params.append('client_secret', process.env.GOHL_CLIENT_SECRET!);
    params.append('grant_type', grant_type);

    if (grant_type === 'authorization_code' && code) {
      params.append('code', code);
    }

    if (grant_type === 'refresh_token' && auth_res?.refresh_token) {
      params.append('refresh_token', auth_res.refresh_token);
    }

    params.append('user_type', 'Company');
    params.append('redirect_uri', process.env.GOHL_REDIRECT_URI!);

    return {
      method: 'POST',
      url: 'https://services.leadconnectorhq.com/oauth/token', 
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      data: params
    };
  },

  /**
   * Logs token exchange errors with appropriate detail.
   */
  logTokenError(err: any, isLocationToken: boolean) {
    if (isLocationToken) {
      console.error('❌ GHL token exchange error:');
      console.error('↳ Message:', err.message);
      console.error('↳ Status:', err.response?.status);
      console.error('↳ Response Data:', err.response?.data);
      console.error('↳ Headers:', err.response?.headers);
    } else {
      console.error('Token exchange error at token exchange:', err?.response?.data || err.message);
    }
  },

  /**
   * Verifies the given token by calling a protected GHL endpoint.
   */
  async verifyToken(token: string) {
    const response = await fetch('https://api.gohighlevel.com/v1/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.ok;
  }
};