import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit";

type PortfolioState = {
  activeFilter: string;
  theme: "light" | "dark";
};

const initialState: PortfolioState = {
  activeFilter: "All",
  theme: "light",
};

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    setActiveFilter(state, action: PayloadAction<string>) {
      state.activeFilter = action.payload;
    },
    toggleTheme(state) {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
  },
});

export const { setActiveFilter, toggleTheme } = portfolioSlice.actions;

export const store = configureStore({
  reducer: {
    portfolio: portfolioSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
