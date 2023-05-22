import { AnyAction, configureStore, ThunkDispatch } from '@reduxjs/toolkit';
import authReducer from '../slicers/authentification/auth-slice';
import subjectReducer from '../slicers/chat/subject-slice';
import roleReducer from '../slicers/user/role-slice';
import invitationReducer from '../slicers/user/invite-slice';
import folderReducer from '../slicers/file/folder-slice';
import fileReducer from '../slicers/file/file-slice';
import conversationReducer from '../slicers/chat/conversation-slice';
import { errorMiddleware } from './middleware';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        subject: subjectReducer,
        role: roleReducer,
        invitation: invitationReducer,
        folder: folderReducer,
        file: fileReducer,
        conversation: conversationReducer,
    },
    middleware: getDefaultMiddleware => [
        ...getDefaultMiddleware(),
        errorMiddleware,
    ],
});

export type AppDispatch = ThunkDispatch<RootState, undefined, AnyAction>;
export type RootState = ReturnType<typeof store.getState>;
