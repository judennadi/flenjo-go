import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../reducers/auth";
import restaurantReducer from "../reducers/restaurants";

const store = configureStore({
  reducer: {
    auth: authReducer,
    restaurants: restaurantReducer,
  },
});

export default store;
