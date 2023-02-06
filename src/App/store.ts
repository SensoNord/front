import { configureStore, ThunkDispatch } from "@reduxjs/toolkit";
import authReducer, { logout } from "../slicers/auth-slice";
import subjectReducer from "../slicers/subject-slice";
import { AnyAction, Dispatch, Middleware, MiddlewareAPI } from 'redux';

const errorMiddleware: Middleware = ({ dispatch }: MiddlewareAPI) => (next: Dispatch) => (action: any) => {
    try {
        if (action.error && action.type.includes('rejected')) {
            dispatch(logout())
        }
        return next(action);
    } catch (error) {
        return error;
    }
};


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