import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  restaurants: [],
  bars: [],
  hotels: [],
  term: "",
  rating: "",
  isResSearch: false,
  isBarSearch: false,
  isHotSearch: false,
};

const restaurantSlice = createSlice({
  name: "restaurants",
  initialState,
  reducers: {
    SET_RES_TERM: (state, action) => {
      state.term = action.payload;
      state.isResSearch = true;
      state.isHotSearch = false;
      state.isBarSearch = false;
    },
    SET_BAR_TERM: (state, action) => {
      state.term = action.payload;
      state.isBarSearch = true;
      state.isResSearch = false;
      state.isHotSearch = false;
    },
    SET_HOT_TERM: (state, action) => {
      state.term = action.payload;
      state.isHotSearch = true;
      state.isBarSearch = false;
      state.isResSearch = false;
    },
    CLEAR_TERM: (state) => {
      state.term = "";
      state.isHotSearch = false;
      state.isBarSearch = false;
      state.isResSearch = false;
    },
    SET_RATING: (state, action) => {
      state.rating = action.payload;
    },
    CLEAR_RATING: (state) => {
      state.rating = "";
    },
  },
});

export const {
  SET_RESTAURANTS,
  SET_BARS,
  SET_HOTELS,
  SET_RES_TERM,
  SET_BAR_TERM,
  SET_HOT_TERM,
  CLEAR_TERM,
  SET_RATING,
  CLEAR_RATING,
} = restaurantSlice.actions;
export default restaurantSlice.reducer;
