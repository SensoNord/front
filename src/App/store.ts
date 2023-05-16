import { AnyAction, configureStore, ThunkDispatch } from '@reduxjs/toolkit';
import authReducer from '../slicers/auth-slice';
import subjectReducer from '../slicers/subject-slice';
import roleReducer from '../slicers/role-slice';
import invitationReducer from '../slicers/invite-slice';
import { errorMiddleware } from './middleware';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        subject: subjectReducer,
        role: roleReducer,
        invitation: invitationReducer,
    },
    middleware: getDefaultMiddleware => [
        ...getDefaultMiddleware(),
        errorMiddleware,
    ],
});

export type AppDispatch = ThunkDispatch<RootState, undefined, AnyAction>;
export type RootState = ReturnType<typeof store.getState>;