import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { directus } from '../libraries/directus';
import { CredentialsType } from '../types/Users/Credentials/CredentialsType';
import { TokenType } from '../types/Users/Credentials/TokenTypes';
import { ErrorType } from '../types/Request/ErrorType';
import { StatusEnum } from '../types/Request/StatusEnum';
import { RoleItem, UserType } from '@directus/sdk';

interface LoginState {
    token: TokenType;
    connectedUser: UserType;
    connectedUserRole: RoleItem;
    status: StatusEnum;
    error: ErrorType;
}

const initialState: LoginState = {
    token: {} as TokenType,
    connectedUser: {} as UserType,
    connectedUserRole: {} as RoleItem,
    status: StatusEnum.IDLE,
    error: {} as ErrorType,
};

export const fetchLogin = createAsyncThunk(
    'auth/fetchLogin',
    async (credentials: CredentialsType, { rejectWithValue }) => {
        try {
            const response = await directus.auth.login(credentials);
            return response;
        } catch (error: any) {
            return rejectWithValue({
                error: error.message,
                status: error.response.status,
            });
        }
    },
);

export const fetchConnectedUser = createAsyncThunk(
    'auth/fetchConnectedUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await directus.users.me.read();
            return response as UserType;
        } catch (error: any) {
            return rejectWithValue({
                error: error.message,
                status: error.response.status,
            });
        }
    },
);

export const fetchConnectedUserRole = createAsyncThunk(
    'auth/fetchConnectedUserRole',
    async (_, { rejectWithValue, getState }) => {
        try {
            const state = getState() as any;
            const connectedUser = state.auth.connectedUser;
            const response = await directus.roles.readByQuery({
                filter: {
                    id: { _eq: connectedUser.role },
                },
            });
            return response as RoleItem;
        } catch (error: any) {
            return rejectWithValue({
                error: error.message,
                status: error.response.status,
            });
        }
    },
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginWithToken: (state, action) => {
            state.status = StatusEnum.SUCCEEDED;
            state.token = action.payload;
        },
        logout: () => {
            localStorage.clear();
            return initialState;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchLogin.pending, state => {
                state.status = StatusEnum.LOADING;
                state.token = {} as TokenType;
                state.error = {} as ErrorType;
            })
            .addCase(fetchLogin.fulfilled, (state, action) => {
                state.status = StatusEnum.SUCCEEDED;
                state.token = action.payload as TokenType;
                state.error = {} as ErrorType;
            })
            .addCase(fetchLogin.rejected, (state, action) => {
                state.status = StatusEnum.FAILED;
                state.token = {} as TokenType;
                state.error = action.payload as ErrorType;
            })
            .addCase(fetchConnectedUser.pending, state => {
                state.status = StatusEnum.LOADING;
                state.connectedUser = {} as UserType;
                state.error = {} as ErrorType;
            })
            .addCase(fetchConnectedUser.fulfilled, (state, action) => {
                state.status = StatusEnum.SUCCEEDED;
                state.connectedUser = action.payload as UserType;
                state.error = {} as ErrorType;
            })
            .addCase(fetchConnectedUser.rejected, (state, action) => {
                state.status = StatusEnum.FAILED;
                state.connectedUser = {} as UserType;
                state.error = action.payload as ErrorType;
            })
            .addCase(fetchConnectedUserRole.pending, state => {
                state.status = StatusEnum.LOADING;
                state.connectedUserRole = {} as RoleItem;
                state.error = {} as ErrorType;
            })
            .addCase(fetchConnectedUserRole.fulfilled, (state, action) => {
                state.status = StatusEnum.SUCCEEDED;
                state.connectedUserRole = action.payload as RoleItem;
                state.error = {} as ErrorType;
            })
            .addCase(fetchConnectedUserRole.rejected, (state, action) => {
                state.status = StatusEnum.FAILED;
                state.connectedUserRole = {} as RoleItem;
                state.error = action.payload as ErrorType;
            });
    },
});

export const { logout, loginWithToken } = authSlice.actions;
export default authSlice.reducer;
