/**
 * AuthController integration tests
 * (Fastify stubs, full mocking, no HTTP server)
 */
import {
  FastifyRequest,
  FastifyReply,
  RouteGenericInterface,
} from 'fastify';

/* ── 1. crypto‑js mock (must precede code import) ─────────── */
jest.mock('crypto-js', () => {
  const decrypt = jest.fn();
  const AES = { decrypt };
  const enc = { Utf8: {} };

  return {
    __esModule: true,
    default: { AES, enc }, // ESM import
    AES,                    // CJS require
    enc,
  };
});

/* ── 2. external libs ─────────────────────────────────────── */
jest.mock('axios');                    // manual mock lives in __mocks__
import axios from 'axios';
import { mocked } from 'jest-mock';


const mockAxios = mocked(axios, { shallow: false });


/* ── 3. internal modules ──────────────────────────────────── */
jest.mock('../src/controllers/UserController', () => ({
  updateUserController: jest.fn(),
}));

jest.mock('../src/controllers/AuthController', () => {
  const real = jest.requireActual('../src/controllers/AuthController');
  return {
    ...real,
    attemptFetchLocationToken: jest.fn().mockResolvedValue(undefined),
    updateAccessToken       : jest.fn().mockResolvedValue(undefined),
  };
});

/* ── 4. code under test (after mocks) ─────────────────────── */
import * as AuthController from '../src/controllers/AuthController';
import * as UserController from '../src/controllers/UserController';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';

/* ── helpers ──────────────────────────────────────────────── */
type Req<T extends RouteGenericInterface> = FastifyRequest<T>;

const ORIGINAL_ENV = { ...process.env };
afterAll(() => {
  process.env = ORIGINAL_ENV;
});

const mockReply = (): FastifyReply =>
  ({
    status: jest.fn().mockReturnThis(),
    send  : jest.fn(),
    header: jest.fn().mockReturnThis(),
  } as unknown as FastifyReply);

/* ── handleInitialInstall SUITE ───────────────────────────── */
describe('handleInitialInstall', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    jest.useFakeTimers();
    process.env.GOHL_REDIRECT_URI = 'http://redirect-uri';
  });

  afterEach(async () => {
    await jest.runOnlyPendingTimersAsync();
    jest.useRealTimers();
  });

  it('returns 200 + payload when token exchange succeeds', async () => {
    mockAxios.request.mockResolvedValueOnce({
      data: { companyId: 'company123', access_token: 'token123' },
    });

    type Route = { Body: { code: string } };
    const req   = { body: { code: 'auth-code' } } as unknown as Req<Route>;
    const reply = mockReply();

    await AuthController.handleInitialInstall(req, reply);

    expect(reply.send).toHaveBeenCalledWith({
      success    : true,
      companyId  : 'company123',
      redirectUri: 'http://redirect-uri',
    });
    expect(AuthController.attemptFetchLocationToken).toHaveBeenCalledWith(
      'company123',
      'token123',
    );
  });

  it('returns 500 when token exchange returns no companyId', async () => {
    mockAxios.request.mockResolvedValueOnce({ data: {} });

    type Route = { Body: { code: string } };
    const req   = { body: { code: 'auth-code' } } as unknown as Req<Route>;
    const reply = mockReply();

    await AuthController.handleInitialInstall(req, reply);

    expect(reply.status).toHaveBeenCalledWith(500);
    expect(reply.send).toHaveBeenCalledWith({
      error: 'Failed to exchange code for token',
    });
  });

  it('returns 500 when token exchange throws', async () => {
    mockAxios.request.mockRejectedValueOnce(new Error('boom'));

    type Route = { Body: { code: string } };
    const req   = { body: { code: 'auth-code' } } as unknown as Req<Route>;
    const reply = mockReply();

    await AuthController.handleInitialInstall(req, reply);

    expect(reply.status).toHaveBeenCalledWith(500);
    expect(reply.send).toHaveBeenCalledWith({
      error: 'Failed to exchange code for token',
    });
  });
});

/* ── validateSsoController SUITE ──────────────────────────── */
describe('validateSsoController', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    process.env.JWT_SECRET  = 'secret';
    process.env.GHL_SSO_KEY = 'sso-key';
  });

  it('decrypts SSO token, sets cookie, and upserts user', async () => {
    const fakeUser = {
      userId       : 'user123',
      email        : 'user@example.com',
      role         : 'user',
      locationId   : 'loc123',
      companyId    : 'company123',
      userName     : 'User Test',
      type         : 'standard',
      activeLocation: 'loc123',
    };

    /* mock decryption */
    (CryptoJS as any).AES.decrypt.mockReturnValue({
      toString: () => JSON.stringify(fakeUser),
    });

    /* mock DB update */
    (UserController.updateUserController as jest.Mock).mockResolvedValue({
      searchHistory: [],
    });

    /* mock jwt.sign */
    const jwtSignSpy = jest.spyOn(jwt, 'sign') as unknown as jest.SpyInstance<
    string,
    Parameters<typeof jwt.sign>
  >;
  jwtSignSpy.mockReturnValue('fake-jwt-token');

    type Route = { Body: { ssoToken: string } };
    const req   = { body: { ssoToken: 'enc-token' } } as unknown as Req<Route>;
    const reply = mockReply();

    await AuthController.validateSsoController(req, reply);

    expect(reply.header).toHaveBeenCalledWith(
      'Set-Cookie',
      expect.stringContaining('token=fake-jwt-token'),
    );
    expect(reply.send).toHaveBeenCalledWith({
      status: 'success',
      data  : { ...fakeUser, searchHistory: [] },
      token : 'fake-jwt-token',
    });
  });

  it('returns 401 when decryption yields empty string', async () => {
    (CryptoJS as any).AES.decrypt.mockReturnValue({ toString: () => '' });

    type Route = { Body: { ssoToken: string } };
    const req   = { body: { ssoToken: 'bad-token' } } as unknown as Req<Route>;
    const reply = mockReply();

    await AuthController.validateSsoController(req, reply);

    expect(reply.status).toHaveBeenCalledWith(401);
    expect(reply.send).toHaveBeenCalledWith({ error: 'Invalid SSO token' });
  });
});
