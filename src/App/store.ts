import { AnyAction, configureStore, ThunkDispatch } from "@reduxjs/toolkit";
import authReducer from "../slicers/auth-slice";
import subjectReducer from "../slicers/subject-slice";
import roleReducer from "../slicers/role-slice";
import { errorMiddleware } from "./middleware";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    subject: subjectReducer,
    role: roleReducer,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    errorMiddleware,
  ],
});

export type AppDispatch = ThunkDispatch<RootState, undefined, AnyAction>;
export type RootState = ReturnType<typeof store.getState>;
