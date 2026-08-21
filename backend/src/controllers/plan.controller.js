import {
  getAvailablePlans,
  purchasePlan,
  verifyPlanPayment,
  getMyCurrentPlan,
} from "../services/plan.service.js";

// ==================== LIST PLANS ====================
export const listPlans = (req, res) => {
  res.status(200).json({ success: true, plans: getAvailablePlans() });
};

// ==================== PURCHASE PLAN ====================
export const buyPlan = async (req, res) => {
  try {
    const result = await purchasePlan(req.user.id, req.body);
    res.status(201).json({ success: true, ...result });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ==================== VERIFY PLAN PAYMENT ====================
export const verifyPlan = async (req, res) => {
  try {
    const userPlan = await verifyPlanPayment(req.user.id, req.body);
    res.status(200).json({ success: true, userPlan });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ==================== GET MY PLAN ====================
export const myPlan = async (req, res) => {
  try {
    const plan = await getMyCurrentPlan(req.user.id);
    res.status(200).json({ success: true, plan });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};