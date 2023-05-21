import { AnyAction, Dispatch, Middleware, MiddlewareAPI } from 'redux';
import { fetchConnectedUser, logout } from '../slicers/authentification/auth-slice';
import { ThunkDispatch } from '@reduxjs/toolkit';

export const errorMiddleware: Middleware =
    ({ dispatch }: MiddlewareAPI) =>
        (next: Dispatch) =>
            async (action: any) => {
                try {
                    if (action.error) {
                        if (action.payload.status === 401) {
                            dispatch(logout());
                        } else {
                            const isNetworkError = action.payload.status === 0;
                            if (!isNetworkError) {
                                await (dispatch as ThunkDispatch<{}, {}, AnyAction>)(fetchConnectedUser());
                            } else {
                                console.error('Network error occurred');
                                dispatch(logout());
                            }
                        }
                    }
                    return next(action);
                } catch (error) {
                    return error;
                }
            };

