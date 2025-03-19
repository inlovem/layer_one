// src/utils/scheduler.ts
import { fastifySchedule } from '@fastify/schedule';
import { CronJob, AsyncTask } from 'toad-scheduler';
import { prisma } from './prismaClient.js';
import { getGHLToken, attemptFetchLocationToken } from '../controllers/AuthController.js';
// Adjust import paths as needed

const TWELVE_HOURS_MS = 12 * 3600 * 1000;

async function checkAndRefreshTokens() {
  console.log('[Cron] Checking tokens for refresh at:', new Date().toISOString());

  try {
    // 1) Refresh Company Tokens
    await refreshCompanyTokens();

    // 2) Refresh Location Tokens
    await refreshLocationTokens();

  } catch (err) {
    console.error('[Cron] Error refreshing tokens:', err);
  }
}

// ---------------------
// REFRESH COMPANY TOKENS
// ---------------------
async function refreshCompanyTokens() {
  const batchSize = 1000;
  let skip = 0;
  let tokensBatch = await prisma.token.findMany({
    skip,
    take: batchSize,
    where: { userType: 'Company' },
  });

  while (tokensBatch.length > 0) {
    for (const token of tokensBatch) {
      const updatedAtMs = token.updatedAt.getTime();
      const tokenLifetimeMs = token.expires_in * 1000;
      const expiryTime = updatedAtMs + tokenLifetimeMs;
      const now = Date.now();

      // If the company token expires within 12 hours, refresh it
      if (expiryTime < now + TWELVE_HOURS_MS) {
        console.log(`[Cron] Refreshing Company token ${token.id} for companyId=${token.companyId}`);
        try {
          const refreshedCompanyToken = await getGHLToken('refresh_token', '', token as any, '');
          console.log(`✔️ [Cron] Company token refreshed: ${token.id}`);

          // Once the company token is refreshed, fetch location tokens
          // to ensure they're up-to-date if they're missing or invalid.
          if (refreshedCompanyToken.access_token && token.companyId) {
            console.log(`[Cron] Fetching location tokens for companyId=${token.companyId}`);
            await attemptFetchLocationToken(
              token.companyId,
              refreshedCompanyToken.access_token
            );
          }
        } catch (refreshErr) {
          console.error(`Error refreshing Company token ${token.id}:`, refreshErr);
        }
      }
    }

    skip += batchSize;
    tokensBatch = await prisma.token.findMany({
      skip,
      take: batchSize,
      where: { userType: 'Company' },
    });
  }
}

// ---------------------
// REFRESH LOCATION TOKENS
// ---------------------
async function refreshLocationTokens() {
  const batchSize = 1000;
  let skip = 0;
  let tokensBatch = await prisma.token.findMany({
    skip,
    take: batchSize,
    where: { userType: 'Location' },
  });

  while (tokensBatch.length > 0) {
    for (const token of tokensBatch) {
      const updatedAtMs = token.updatedAt.getTime();
      const tokenLifetimeMs = token.expires_in * 1000;
      const expiryTime = updatedAtMs + tokenLifetimeMs;
      const now = Date.now();

      // If the location token expires within 12 hours, refresh it
      if (expiryTime < now + TWELVE_HOURS_MS) {
        console.log(`[Cron] Refreshing Location token ${token.id}, locationId=${token.locationId}`);
        try {
          // 1) Retrieve the associated company token from DB
          const companyToken = await prisma.token.findFirst({
            where: {
              companyId: token.companyId,
              userType: 'Company',
            },
          });
          if (!companyToken || !companyToken.access_token) {
            console.warn(`⚠️ No valid Company token found for locationId=${token.locationId}`);
            continue;
          }

          // 2) Refresh location token using the *current* company token’s access_token
          await getGHLToken('', '', token as any, companyToken.access_token);
        } catch (refreshErr) {
          console.error(`Error refreshing Location token ${token.id}:`, refreshErr);
        }
      }
    }

    skip += batchSize;
    tokensBatch = await prisma.token.findMany({
      skip,
      take: batchSize,
      where: { userType: 'Location' },
    });
  }
}

// ---------------------
// CRON TASK SETUP
// ---------------------
const tokenRefreshTask = new AsyncTask('Token Refresh Task', async (taskId) => {
  console.log(`Task ${taskId} started at:`, new Date().toISOString());
  await checkAndRefreshTokens();
});

const tokenRefreshJob = new CronJob(
  { cronExpression: '0 * * * *' }, // {* * * * *} Run every minute for testing
  tokenRefreshTask
);

export async function schedulerPlugin(fastifyInstance: any) {
  fastifyInstance.register(fastifySchedule);
  fastifyInstance.addHook('onReady', () => {
    fastifyInstance.scheduler.addCronJob(tokenRefreshJob);
    fastifyInstance.log.info("Token refresh cron job has been scheduled.");
  });
}