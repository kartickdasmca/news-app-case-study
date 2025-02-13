import { combineReducers, configureStore } from "@reduxjs/toolkit";

import layoutSlice from "../features/layoutSlice";
import preferencesSlice from "../features/preferencesSlice";
import articlesSlice from "../features/articleSlice";

const rootReducer = combineReducers({
  layout: layoutSlice,
  preferences: preferencesSlice,
  articles: articlesSlice,
});
export const store = configureStore({
  reducer: rootReducer,
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
