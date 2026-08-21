import express from "express";
import { listPlans, buyPlan, verifyPlan, myPlan } from "../controllers/plan.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { validate } from "../middlewares/validate.js";
import { purchasePlanSchema, verifyPlanSchema } from "../validators/plan.validator.js";

const router = express.Router();

// ==================== PLAN ROUTES ====================
router.get("/", listPlans);
router.post("/purchase", authenticate, validate(purchasePlanSchema), buyPlan);
router.post("/verify-payment", authenticate, validate(verifyPlanSchema), verifyPlan);
router.get("/me", authenticate, myPlan);

export default router;