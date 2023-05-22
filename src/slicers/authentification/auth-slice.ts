import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { directus } from '../../libraries/directus';
import { CredentialsType } from '../../types/Users/CredentialsType';
import { ErrorType } from '../../types/Request/ErrorType';
import { StatusEnum } from '../../types/Request/StatusEnum';
import { RoleItem, UserType } from '@directus/sdk';
import { AuthResult } from '@directus/sdk';
import { UserInformationType } from '../../types/Users/UserInformationType';

export const fetchLoginType = 'auth/fetchLogin';

interface LoginState {
    isConnecting: boolean;
    token: AuthResult | null;
    connectedUser: UserType;
    connectedUserRole: RoleItem;
    status: StatusEnum;
    error: ErrorType;
}

const initialState: LoginState = {
    isConnecting: false,
    token: null,
    connectedUser: {} as UserType,
    connectedUserRole: {} as RoleItem,
    status: StatusEnum.IDLE,
    error: {} as ErrorType,
};

export const fetchLogin = createAsyncThunk(
    fetchLoginType,
    async (credentials: CredentialsType, { rejectWithValue }) => {
        try {
            const response = await directus.auth.login(credentials);
            return response as AuthResult;
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
            return response.data![0] as unknown as RoleItem;
        } catch (error: any) {
            return rejectWithValue({
                error: error.message,
                status: error.response.status,
            });
        }
    },
);

export const updateCurrentUser = createAsyncThunk(
    'auth/updateCurrentUser',
    async (userInformation: UserInformationType, { rejectWithValue }) => {
        try {
            await directus.users.me.update({
                first_name: userInformation.first_name,
                last_name: userInformation.last_name,
            });
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
        setIsConnecting: (state, action) => {
            state.isConnecting = action.payload;
            state.status = StatusEnum.IDLE;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchLogin.pending, state => {
                state.status = StatusEnum.LOADING;
                state.token = {} as AuthResult;
                state.error = {} as ErrorType;
            })
            .addCase(fetchLogin.fulfilled, (state, action) => {
                state.status = StatusEnum.SUCCEEDED;
                state.token = action.payload as AuthResult;
                state.error = {} as ErrorType;
            })
            .addCase(fetchLogin.rejected, (state, action) => {
                state.status = StatusEnum.FAILED;
                state.token = {} as AuthResult;
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
                state.isConnecting = false;
            })
            .addCase(fetchConnectedUser.rejected, (state, action) => {
                state.status = StatusEnum.FAILED;
                state.connectedUser = {} as UserType;
                state.error = action.payload as ErrorType;
                state.isConnecting = true;
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
            })
            .addCase(updateCurrentUser.pending, state => {
                state.status = StatusEnum.LOADING;
                state.error = {} as ErrorType;
            })
            .addCase(updateCurrentUser.fulfilled, (state, action) => {
                state.status = StatusEnum.SUCCEEDED;
                state.error = {} as ErrorType;
            })
            .addCase(updateCurrentUser.rejected, (state, action) => {
                state.status = StatusEnum.FAILED;
                state.error = action.payload as ErrorType;
            });
    },
});

export const { logout, loginWithToken, setIsConnecting } = authSlice.actions;
export default authSlice.reducer;
