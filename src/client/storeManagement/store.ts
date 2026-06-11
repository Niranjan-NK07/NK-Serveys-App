import { configureStore } from "@reduxjs/toolkit";
import homeReducer from "./initSlice";

export const store = configureStore({
  reducer: {
    homeRed: homeReducer,
  },
});
