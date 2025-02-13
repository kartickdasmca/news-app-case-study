import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SelectedPage } from "../../types";

interface InitialState {
  selectedPage: SelectedPage; // Using the Enum
  isTopOfPage: boolean;
}

const initialState: InitialState = {
  selectedPage: SelectedPage.Home,
  isTopOfPage: true,
};

const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    setSelectedPage: (state, action: PayloadAction<SelectedPage>) => {
      state.selectedPage = action.payload;
    },
    setIsTopOfPage: (state, action: PayloadAction<boolean>) => {
      state.isTopOfPage = action.payload;
    },
  },
});

export const { setSelectedPage, setIsTopOfPage } = layoutSlice.actions;
export default layoutSlice.reducer;
