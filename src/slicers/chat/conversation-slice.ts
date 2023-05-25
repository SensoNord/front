import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { directus } from '../../libraries/directus';
import { ConversationType } from '../../types/Chat/ConversationType';
import {
    PayLoadCreateConversationMessage,
    PayLoadUpdateConversationMessage,
    conversationFields,
    messageFields,
    conversationListFields,
    PayloadFetchConversationByIdAndPage,
} from './conversation-slice-helper';
import { StatusEnum } from '../../types/Request/StatusEnum';
import { ErrorType } from '../../types/Request/ErrorType';
import { MessageType } from '../../types/Chat/MessageType';

interface ConversationState {
    conversationListDisplay: ConversationType[];
    currentConversationDisplayWithAllRelatedData: ConversationType | null;
    conversationListForFolder: ConversationType[];
    status: StatusEnum;
    error: ErrorType;
}

const initialState: ConversationState = {
    conversationListDisplay: [] as ConversationType[],
    currentConversationDisplayWithAllRelatedData: null,
    conversationListForFolder: [] as ConversationType[],
    status: StatusEnum.IDLE,
    error: {} as ErrorType,
};

export const fetchAllVisibleConversation = createAsyncThunk(
    'conversation/fetchAllVisibleConversation',
    async (_, { rejectWithValue }) => {
        try {
            const response = await directus.items('conversations').readByQuery({
                limit: -1,
                fields: conversationListFields,
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

export const fetchConversationByIdAndPage = createAsyncThunk(
    'conversation/fetchConversationByIdAndPage',
    async (payLoad: PayloadFetchConversationByIdAndPage, { rejectWithValue }) => {
        try {
            const response = await directus.items('conversations').readOne(payLoad.conversationId, {
                fields: conversationFields,
                deep: {
                    messages_list: {
                        _limit: 10,
                        _sort: '-date_created',
                        _page: payLoad.page,
                    }
                },
            });
            return response as ConversationType;
        } catch (error: any) {
            return rejectWithValue({
                error: error.message,
                status: error.response.status,
            });
        }
    },
);

export const fetchConversationByFolderId = createAsyncThunk(
    'items/fetchConversationByFolderId',
    async (folderId: string, { rejectWithValue }) => {
        try {
            const response = await directus.items('conversations').readByQuery({
                filter: {
                    folder_id: {
                        _eq: folderId,
                    },
                },
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

export const createMessageToConversation = createAsyncThunk(
    'conversation/createMessageToConversation',
    async (payLoadCreateConversationMessage: PayLoadCreateConversationMessage, { rejectWithValue }) => {
        try {
            const response = await directus.items('messages').createOne(
                {
                    conversation_id: payLoadCreateConversationMessage.conversation_id,
                    message: payLoadCreateConversationMessage.message,
                    file_id: payLoadCreateConversationMessage.fileId,
                },
                {
                    fields: messageFields,
                },
            );
            return response as MessageType;
        } catch (error: any) {
            return rejectWithValue({
                error: error.message,
                status: error.response.status,
            });
        }
    },
);

export const deleteMessageById = createAsyncThunk(
    'conversation/deleteMessageById',
    async (messageId: string, { rejectWithValue }) => {
        try {
            await directus.items('messages').deleteOne(messageId);
        } catch (error: any) {
            return rejectWithValue({
                error: error.message,
                status: error.response.status,
            });
        }
    },
);

export const updateMessageById = createAsyncThunk(
    'conversation/updateMessageById',
    async (payLoadUpdateMessage: PayLoadUpdateConversationMessage, { rejectWithValue }) => {
        try {
            const response = await directus.items('messages').updateOne(
                payLoadUpdateMessage.messageId,
                {
                    message: payLoadUpdateMessage.message,
                },
                {
                    fields: messageFields,
                },
            );
            return response as MessageType;
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
        setCurrentConversationDisplayWithAllRelatedData: (state, action) => {
            const foundConversation = state.conversationListDisplay.find(
                (conversation: ConversationType) => conversation.id === action.payload,
            );
            if (foundConversation) {
                state.currentConversationDisplayWithAllRelatedData = foundConversation;
            }
        },
        clearCurrentConversationDisplayWithAllRelatedData: state => {
            state.currentConversationDisplayWithAllRelatedData = null;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchAllVisibleConversation.pending, state => {
                state.status = StatusEnum.LOADING;
                state.error = {} as ErrorType;
            })
            .addCase(fetchAllVisibleConversation.fulfilled, (state, action) => {
                state.status = StatusEnum.SUCCEEDED;
                state.conversationListDisplay = action.payload;
                state.error = {} as ErrorType;
            })
            .addCase(fetchAllVisibleConversation.rejected, (state, action) => {
                state.status = StatusEnum.FAILED;
                state.error = action.payload as ErrorType;
            })
            .addCase(fetchConversationByIdAndPage.pending, state => {
                state.status = StatusEnum.LOADING;
                state.error = {} as ErrorType;
            })
            .addCase(fetchConversationByIdAndPage.fulfilled, (state, action) => {
                state.status = StatusEnum.SUCCEEDED;
                if (state.currentConversationDisplayWithAllRelatedData?.messages_list) {
                    state.currentConversationDisplayWithAllRelatedData.messages_list = [...state.currentConversationDisplayWithAllRelatedData.messages_list, ...action.payload.messages_list];
                } else {
                    state.currentConversationDisplayWithAllRelatedData = action.payload;
                }
                state.error = {} as ErrorType;
            })
            .addCase(fetchConversationByIdAndPage.rejected, (state, action) => {
                state.status = StatusEnum.FAILED;
                state.error = action.payload as ErrorType;
            })
            .addCase(fetchConversationByFolderId.pending, state => {
                state.status = StatusEnum.LOADING;
                state.error = {} as ErrorType;
            })
            .addCase(fetchConversationByFolderId.fulfilled, (state, action) => {
                state.status = StatusEnum.SUCCEEDED;
                state.conversationListForFolder = action.payload;
                state.error = {} as ErrorType;
            })
            .addCase(fetchConversationByFolderId.rejected, (state, action) => {
                state.status = StatusEnum.FAILED;
                state.error = action.payload as ErrorType;
            })
            .addCase(createMessageToConversation.pending, state => {
                state.status = StatusEnum.LOADING;
                state.error = {} as ErrorType;
            })
            .addCase(createMessageToConversation.fulfilled, (state, action) => {
                state.status = StatusEnum.SUCCEEDED;
                state.error = {} as ErrorType;
            })
            .addCase(createMessageToConversation.rejected, (state, action) => {
                state.status = StatusEnum.FAILED;
                state.error = action.payload as ErrorType;
            })
            .addCase(deleteMessageById.pending, state => {
                state.status = StatusEnum.LOADING;
                state.error = {} as ErrorType;
            })
            .addCase(deleteMessageById.fulfilled, (state, action) => {
                state.status = StatusEnum.SUCCEEDED;
                const conversationId = action.meta.arg;
                state.conversationListDisplay = state.conversationListDisplay.map((conversation: ConversationType) => {
                    if (conversation.messages_list)
                        return {
                            ...conversation,
                            messages_list: (conversation.messages_list as MessageType[]).filter(
                                (message: MessageType) => message.id !== conversationId,
                            ),
                        };
                    return conversation;
                });
                state.error = {} as ErrorType;
            })
            .addCase(deleteMessageById.rejected, (state, action) => {
                state.status = StatusEnum.FAILED;
                state.error = action.payload as ErrorType;
            })
            .addCase(updateMessageById.pending, state => {
                state.status = StatusEnum.LOADING;
                state.error = {} as ErrorType;
            })
            .addCase(updateMessageById.fulfilled, (state, action) => {
                state.status = StatusEnum.SUCCEEDED;
                state.conversationListDisplay = state.conversationListDisplay.map((conversation: ConversationType) => {
                    if (conversation.messages_list)
                        return {
                            ...conversation,
                            messages_list: (conversation.messages_list as MessageType[]).map((message: MessageType) => {
                                if (message.id === action.payload.id) {
                                    return action.payload;
                                }
                                return message;
                            }),
                        };
                    return conversation;
                });
                state.error = {} as ErrorType;
            })
            .addCase(updateMessageById.rejected, (state, action) => {
                state.status = StatusEnum.FAILED;
                state.error = action.payload as ErrorType;
            });
    },
});

export default conversationSlice.reducer;
export const { setCurrentConversationDisplay, setCurrentConversationDisplayWithAllRelatedData, clearCurrentConversationDisplayWithAllRelatedData } =
    conversationSlice.actions;
