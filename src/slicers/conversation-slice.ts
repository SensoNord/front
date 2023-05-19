import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { directus } from '../libraries/directus';
import { ConversationType } from '../types/Chat/ConversationType';
import { conversationFields } from './conversation-slice-helper';
import { StatusEnum } from '../types/Request/StatusEnum';
import { ErrorType } from '../types/Request/ErrorType';

interface ConversationState {
    conversationListDisplay: ConversationType[];
    currentConversationDisplayWithAllRelatedData: ConversationType | null;
    status: StatusEnum;
    error: ErrorType;
}

const initialState: ConversationState = {
    conversationListDisplay: [] as ConversationType[],
    currentConversationDisplayWithAllRelatedData: null,
    status: StatusEnum.IDLE,
    error: {} as ErrorType,
};

export const fetchAllVisibleConversationAndRelatedMessage = createAsyncThunk(
    'conversation/fetchAllVisibleConversationAndRelatedMessage',
    async (_, { rejectWithValue }) => {
        try {
            const response = await directus.items('conversations').readByQuery({
                limit: -1,
                fields: conversationFields,
            });
            return response.data as ConversationType[];
        } catch (error: any) {
            return rejectWithValue({
                error: error.message,
                status: error.response.status,
            });
        }
    },
);

const conversationSlice = createSlice({
    name: 'conversation',
    initialState,
    reducers: {
        setCurrentConversationDisplay: (state, action) => {
            state.currentConversationDisplayWithAllRelatedData = action.payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(
                fetchAllVisibleConversationAndRelatedMessage.pending,
                state => {
                    state.status = StatusEnum.LOADING;
                    state.error = {} as ErrorType;
                },
            )
            .addCase(
                fetchAllVisibleConversationAndRelatedMessage.fulfilled,
                (state, action) => {
                    state.status = StatusEnum.SUCCEEDED;
                    state.conversationListDisplay = action.payload;
                    state.error = {} as ErrorType;
                },
            )
            .addCase(
                fetchAllVisibleConversationAndRelatedMessage.rejected,
                (state, action) => {
                    state.status = StatusEnum.FAILED;
                    state.error = action.payload as ErrorType;
                },
            );
    },
});

export default conversationSlice.reducer;
export const { setCurrentConversationDisplay } = conversationSlice.actions;
