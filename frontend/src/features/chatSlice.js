import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeUser: null,
  activeGroup: false,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveUser: (state, action) => {
      state.activeUser = action.payload;
      state.activeGroup = false;
    },
    setActiveGroup: (state) => {
      state.activeGroup = true;
      state.activeUser = null;
    },
  },
});

export const { setActiveUser, setActiveGroup } = chatSlice.actions;
export default chatSlice.reducer;
