import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { valueSeparatorType } from "@/types";

interface GlobalSettingsState {
  valueSeparator: valueSeparatorType;
  jwttoken: string | null;
  watchlist: string[];
  firstLoad: boolean;
}

const initialState: GlobalSettingsState = {
  valueSeparator: "comma",
  jwttoken: null,
  watchlist: [],
  firstLoad: true,
};

export const globalSettingsSlice = createSlice({
  name: "globalSettings",
  initialState,
  reducers: {
    setSeparatorValue: (state, action: PayloadAction<valueSeparatorType>) => {
      state.valueSeparator = action.payload;
    },
    setJwtToken: (state, action: PayloadAction<string | null>) => {
      state.jwttoken = action.payload;
    },
    setWatchlist: (state, action: PayloadAction<string[]>) => {
      state.watchlist = action.payload;
    },
    setFirstLoad: (state, action: PayloadAction<boolean>) => {
      state.firstLoad = action.payload;
    },
  },
});

export const { setSeparatorValue, setJwtToken, setWatchlist, setFirstLoad } =
  globalSettingsSlice.actions;
const globalSettingsReducer = globalSettingsSlice.reducer;

export default globalSettingsReducer;
