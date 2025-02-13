import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PreferencesState } from "../../types";

// Load preferences from localStorage (if available)
const loadPreferences = (): PreferencesState => {
  const storedPreferences = localStorage.getItem("preferences");
  const parsedPreferences: PreferencesState = storedPreferences
    ? JSON.parse(storedPreferences)
    : { category: "", source: "", author: "" };

  return {
    category: parsedPreferences?.category || "",
    source: parsedPreferences?.source || "",
    author: parsedPreferences?.author || "",
  };
};

const initialState: PreferencesState = loadPreferences();

const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    setPreferences: (state, action: PayloadAction<PreferencesState>) => {
      const newPreferences = {
        category: action.payload.category,
        source: action.payload.source,
        author: action.payload.author,
      };

      state.category = newPreferences.category;
      state.source = newPreferences.source;
      state.author = newPreferences.author;

      // Save the UPDATED state to localStorage
      localStorage.setItem("preferences", JSON.stringify(newPreferences));
    },
    clearPreferences: (state) => {
      state.category = "";
      state.source = "";
      state.author = "";
      localStorage.removeItem("preferences");
    },
  },
});

export const { setPreferences, clearPreferences } = preferencesSlice.actions;
export default preferencesSlice.reducer;
