import { PreferencesState } from "../types";
export function preferences() {
  const storedPreferences = localStorage.getItem("preferences");
  const parsedPreferences: PreferencesState = storedPreferences
    ? JSON.parse(storedPreferences)
    : { category: "", source: "", author: "" };
  return parsedPreferences;
}
