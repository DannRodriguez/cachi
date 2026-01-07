import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";

import loginUserReducer from "./loginUser/loginUserReducer";
import selectFolioNombreReducer from "./selectByFolioNombre/selectByFolioNombreReducer";
import menuReducer from "./menu/menuReducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["loginUser", "selectFolioNombre", "menu"],
};

const appReducer = combineReducers({
  loginUser: loginUserReducer,
  selectFolioNombre: selectFolioNombreReducer,
  menu: menuReducer,
});

const rootReducer = (state, action) => {
  if (
    action.type == "RESET_STATE" ||
    action.type.includes("loginUserReducer/logout/fulfilled") ||
    action.type.includes("loginUserReducer/logout/rejected") ||
    action.type.includes("loginUserReducer/refreshToken/rejected")
  ) {
    storage.removeItem("persist:root");
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});
