import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  planType: null,
  expiresAt: null,
};

const planSlice = createSlice({
  name: "plan",
  initialState,
  reducers: {
    setActivePlan: (state, action) => {
      state.planType = action.payload?.planType || null;
      state.expiresAt = action.payload?.expiresAt || null;
    },
    clearActivePlan: (state) => {
      state.planType = null;
      state.expiresAt = null;
    },
  },
});

export const { setActivePlan, clearActivePlan } = planSlice.actions;
export default planSlice.reducer;