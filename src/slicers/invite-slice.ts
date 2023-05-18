import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { directus } from '../libraries/directus';
import { ErrorType } from '../types/Request/ErrorType';
import { StatusEnum } from '../types/Request/StatusEnum';
import { InvitationType } from '../types/Users/InvitationType';

interface InviteState {
    invitationList: Array<InvitationType>;
    status: StatusEnum;
    error: ErrorType;
}

const initialState: InviteState = {
    invitationList: [] as Array<InvitationType>,
    status: StatusEnum.IDLE,
    error: {} as ErrorType,
};

export const sendInvite = createAsyncThunk(
    'invite/sendInvite',
    async (invitation: InvitationType, { rejectWithValue }) => {
        try {
            await directus.users.invites.send(
                invitation.email,
                invitation.roleId,
                'http://localhost:3000/accept-invitation',
            );
            return invitation;
        } catch (error: any) {
            return rejectWithValue({
                error: error.message,
                status: error.response.status,
            });
        }
    },
);

const inviteSlice = createSlice({
    name: 'invitation',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(sendInvite.pending, state => {
                state.status = StatusEnum.LOADING;
                state.error = {} as ErrorType;
            })
            .addCase(sendInvite.fulfilled, (state, action) => {
                state.status = StatusEnum.SUCCEEDED;
                state.invitationList.push(action.payload);
                state.error = {} as ErrorType;
            })
            .addCase(sendInvite.rejected, (state, action) => {
                state.status = StatusEnum.FAILED;
                state.error = action.payload as ErrorType;
            });
    },
});

export default inviteSlice.reducer;
