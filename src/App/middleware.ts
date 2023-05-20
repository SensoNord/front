import { AnyAction, Dispatch, Middleware, MiddlewareAPI } from 'redux';
import { fetchConnectedUser, logout } from '../slicers/auth-slice';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from './hooks';

export const errorMiddleware: Middleware =
    ({ dispatch }: MiddlewareAPI) =>
        (next: Dispatch) =>
            (action: any) => {
                try {
                    if (action.error && action.payload.status === 401) {
                        dispatch(logout());
                    } else if (action.error) {
                        (dispatch as ThunkDispatch<{}, {}, AnyAction>)(fetchConnectedUser());
                    }
                    return next(action);
                } catch (error) {
                    return error;
                }
            };
