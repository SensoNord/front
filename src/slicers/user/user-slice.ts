import { UserType } from '@directus/sdk';
import { ErrorType } from '../../types/Request/ErrorType';
import { StatusEnum } from '../../types/Request/StatusEnum';
import { directus } from '../../libraries/directus';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface UserState {
    userList: UserType[];
    status: StatusEnum;
    error: ErrorType;
}

const initialState: UserState = {
    userList: [] as UserType[],
    status: StatusEnum.IDLE,
    error: {} as ErrorType,
};

export const fetchUserList = createAsyncThunk('user/fetchUserList', async (_, { rejectWithValue, getState }) => {
    try {
        const response = await directus.users.readByQuery({
            limit: -1,
        });
        const state = getState() as any;
        const connectedUser = state.auth.connectedUser;
        const userList = response.data as unknown as UserType[];
        return userList.filter((user: UserType) => user.id !== connectedUser.id);
    } catch (error: any) {
        return rejectWithValue({
            error: error.message,
            status: error.response.status,
        });
    }
});

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchUserList.pending, state => {
                state.status = StatusEnum.LOADING;
                state.error = {} as ErrorType;
            })
            .addCase(fetchUserList.fulfilled, (state, action) => {
                state.status = StatusEnum.SUCCEEDED;
                state.userList = action.payload as UserType[];
                state.error = {} as ErrorType;
            })
            .addCase(fetchUserList.rejected, (state, action) => {
                state.status = StatusEnum.FAILED;
                state.error = action.payload as any;
            });
    },
});

export default userSlice.reducer;
