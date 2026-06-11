import { createSlice } from "@reduxjs/toolkit";
import {
  UtilsState,
  openDrawer,
  closeDrawer,
  updateActivePolls as updatePolls,
  voteOnPoll,
  updateRecPolls,
} from "./utilReducers";

const initialState: UtilsState = {
  openLeftDrawer: false,
  activePolls: [],
  recentPolls: [],
};

const initSlice = createSlice({
  name: "utils",
  initialState,
  reducers: {
    openDrawer,
    closeDrawer,
    updatePolls,
    voteOnPoll,
    updateRecPolls,
  },
});

export const {
  openDrawer: openLeftDrawer,
  closeDrawer: closeLeftDrawer,
  updatePolls: updateActivePolls,
  voteOnPoll: onVoteOnPoll,
  updateRecPolls: updateRecentPolls,
} = initSlice.actions;
export default initSlice.reducer;
