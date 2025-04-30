// src/utils/scheduler.ts
import { CronJob, AsyncTask } from 'toad-scheduler';
import fastifySchedule from '@fastify/schedule';
import admin from './firebase';
import { tokenService } from '../services/TokenService';
import { FastifyInstance } from 'fastify';
import { Timestamp } from 'firebase-admin/firestore';
import type { AuthRes as BaseToken } from '../types/types'; // Adjust path to where your Token type lives
import { locationService } from '../services/LocationService';

const db = admin.firestore();
const ONE_MINUTES_MS = 1 * 60 * 1000;

// -----------------------------
// Extend your Token type to include updatedAt
// -----------------------------
type FirestoreToken = BaseToken & {
  id: string;
  updatedAt: Timestamp | string | Date;
};

// -----------------------------
// Main Task Runner
// -----------------------------
async function checkAndRefreshTokens() {
  console.log('[Cron] Checking tokens for refresh at:', new Date().toISOString());
  try {
    await refreshCompanyTokens();
    await refreshLocationTokens();
  } catch (err) {
    console.error('[Cron] Error refreshing tokens:', err);
  }
}

// -----------------------------
// Refresh Company Tokens
// -----------------------------
async function refreshCompanyTokens() {
  const batchSize = 1000;
  const snapshot = await db
    .collection('tokens')
    .where('userType', '==', 'Company')
    .limit(batchSize)
    .get();

  const tokensBatch: FirestoreToken[] = snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as FirestoreToken)
  );

  for (const token of tokensBatch) {
    const updatedAtMs =
      token.updatedAt instanceof Timestamp
        ? token.updatedAt.toMillis()
        : new Date(token.updatedAt).getTime();

    const tokenLifetimeMs = (token.expires_in ?? 0) * 1000;
    const expiryTime = updatedAtMs + tokenLifetimeMs;
    const now = Date.now();

    if (expiryTime < now + ONE_MINUTES_MS) {
      console.log(`[Cron] Refreshing Company token ${token.id} for companyId=${token.companyId}`);
      try {
        const refreshedCompanyToken = await tokenService.getGHLToken('refresh_token', '', token, '');
        console.log(`✔️ [Cron] Company token refreshed: ${token.id}`);

        if (refreshedCompanyToken.access_token && token.companyId) {
          console.log(`[Cron] Fetching location tokens for companyId=${token.companyId}`);
          await locationService.attemptFetchLocationToken(token.companyId, refreshedCompanyToken.access_token);
        }
      } catch (err) {
        console.error(`Error refreshing Company token ${token.id}:`, err);
      }
    }
  }
}

// -----------------------------
// Refresh Location Tokens
// -----------------------------
async function refreshLocationTokens() {
  const batchSize = 1000;
  const snapshot = await db
    .collection('tokens')
    .where('userType', '==', 'Location')
    .limit(batchSize)
    .get();

  const tokensBatch: FirestoreToken[] = snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as FirestoreToken)
  );

  for (const token of tokensBatch) {
    const updatedAtMs =
      token.updatedAt instanceof Timestamp
        ? token.updatedAt.toMillis()
        : new Date(token.updatedAt).getTime();

    const tokenLifetimeMs = (token.expires_in ?? 0) * 1000;
    const expiryTime = updatedAtMs + tokenLifetimeMs;
    const now = Date.now();

    if (expiryTime < now + ONE_MINUTES_MS) {
      console.log(`[Cron] Refreshing Location token ${token.id}, locationId=${token.locationId}`);
      try {
        const companySnap = await db
          .collection('tokens')
          .where('companyId', '==', token.companyId)
          .where('userType', '==', 'Company')
          .limit(1)
          .get();

        const companyToken = companySnap.docs[0]?.data() as FirestoreToken;

        if (!companyToken?.access_token) {
          console.warn(`⚠️ No valid Company token found for locationId=${token.locationId}`);
          continue;
        }

        await tokenService.getGHLToken('', '', token, companyToken.access_token);
      } catch (err) {
        console.error(`Error refreshing Location token ${token.id}:`, err);
      }
    }
  }
}

// -----------------------------
// Scheduler Plugin
// -----------------------------
const tokenRefreshTask = new AsyncTask('Token Refresh Task', async (taskId) => {
  console.log(`Task ${taskId} started at:`, new Date().toISOString());
  await checkAndRefreshTokens();
});

// Changed to run every minute for testing purposes
const tokenRefreshJob = new CronJob(
  { cronExpression: '* * * * *' },
  tokenRefreshTask
);

export async function schedulerPlugin(fastifyInstance: FastifyInstance) {
  fastifyInstance.register(fastifySchedule);
  fastifyInstance.addHook('onReady', () => {
    fastifyInstance.scheduler.addCronJob(tokenRefreshJob);
    fastifyInstance.log.info('Token refresh cron job has been scheduled to run every minute for testing.');
    
    // Run immediately for testing
    checkAndRefreshTokens().then(() => {
      console.log('[Test] Initial token refresh completed');
    }).catch(err => {
      console.error('[Test] Error during initial token refresh:', err);
    });
  });
}

// Run immediately for testing
checkAndRefreshTokens().then(() => {
  console.log('[Test] Initial token refresh completed');
}).catch(err => {
  console.error('[Test] Error during initial token refresh:', err);
});