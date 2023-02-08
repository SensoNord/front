import { configureStore, ThunkDispatch } from "@reduxjs/toolkit";
import authReducer from "../slicers/auth-slice";
import subjectReducer from "../slicers/subject-slice";
import { AnyAction } from 'redux';
import { errorMiddleware } from "./middleware";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        subject: subjectReducer
    },
    middleware: (getDefaultMiddleware) => [
        ...getDefaultMiddleware(),
        errorMiddleware
    ]
});

export type AppDispatch = ThunkDispatch<RootState, undefined, AnyAction>;
export type RootState = ReturnType<typeof store.getState>;