"use client";
import reducer from "./reducer";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    reducer:reducer,
  },
});

export default store;
