import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import cartReducer from "../features/cart/cartSlice";
import planReducer from "../features/plans/plansSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    plan: planReducer,
  },
});
