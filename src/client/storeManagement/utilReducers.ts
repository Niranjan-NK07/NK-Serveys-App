import { PayloadAction } from "@reduxjs/toolkit";

export interface UtilsState {
  openLeftDrawer: boolean;
  activePolls: any[];
  recentPolls: any[];
}

export const openDrawer = (state: UtilsState) => {
  state.openLeftDrawer = true;
};
export const closeDrawer = (state: UtilsState) => {
  state.openLeftDrawer = false;
};
export const updateActivePolls = (
  state: UtilsState,
  action: PayloadAction<any[]>,
) => {
  state.activePolls = action.payload;
};
export const updateRecPolls = (
  state: UtilsState,
  action: PayloadAction<any[]>,
) => {
  state.activePolls = action.payload;
};
export const voteOnPoll = (
  state: UtilsState,
  action: PayloadAction<{ pollID: string; option: string }>,
) => {
  const { pollID, option } = action.payload;
  const poll = state.activePolls?.find((poll) => poll._id === pollID);

  if (poll) {
    poll.votes = {
      ...poll.votes,
      [option]: (poll?.votes?.[option] || 0) + 1,
    };
  }
};
