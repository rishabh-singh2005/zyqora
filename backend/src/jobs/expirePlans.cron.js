import cron from "node-cron";
import { expireOverduePlans } from "../services/plan.service.js";

// ==================== PLAN EXPIRATION CRON JOB ====================
// Runs every minute, checks for plans past their expiresAt time, deactivates them
export const startPlanExpirationJob = () => {
  cron.schedule("* * * * *", async () => {
    const count = await expireOverduePlans();
    if (count > 0) {
      console.log(`[Cron] Expired ${count} plan(s) at ${new Date().toISOString()}`);
    }
  });
};