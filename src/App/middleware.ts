import { fetchConnectedUser, logout } from '../slicers/authentification/auth-slice';
import { AnyAction, Dispatch, Middleware, MiddlewareAPI, ThunkDispatch } from '@reduxjs/toolkit';

export const errorMiddleware: Middleware =
    ({ dispatch }: MiddlewareAPI) =>
    (next: Dispatch) =>
    async (action: any) => {
        try {
            // si l'action a une erreur
            if (action.error) {
                const { status } = action.payload;
                const { type } = action;
                // si le statut est 401, l'utilisateur n'est pas autorisé, donc on le déconnecte
                if (status === 401) {
                    dispatch(logout());
                } else if (status === 0) {
                    // si le statut est 0, il y a une erreur de réseau
                    console.error('Network error occurred');
                    dispatch(logout());
                } else {
                    // pour les autres types d'erreur, essayons de récupérer l'utilisateur connecté
                    if (!type.startsWith('auth/fetchLogin')) {
                        await (dispatch as ThunkDispatch<{}, {}, AnyAction>)(fetchConnectedUser());
                    } else {
                        console.error('Login error occurred');
                    }
                }
            }
            return next(action);
        } catch (error) {
            console.error('Middleware error:', error);
            return next(action);
        }
    };
