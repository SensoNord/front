// For testing purposes

import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {directus} from '../../libraries/directus';
import {ErrorType} from '../../types/Request/ErrorType';
import {StatusEnum} from '../../types/Request/StatusEnum';
import {SubjectType} from '../../types/Chat/SubjectType';
import {PostType} from '../../types/Chat/PostType';
import {ResponseType} from '../../types/Chat/ResponseType';
import {
    PayLoadAddUserToSubject,
    PayLoadCreateSubject,
    PayLoadCreateSubjectMessage,
    PayLoadCreateSubjectPost, PayloadFetchSubjectByIdAndPage,
    PayLoadUpdateSubjectPost,
    PayLoadUpdateSubjectResponse,
    postFields,
    responseFields,
    subjectFields,
} from './subject-slice-helper';
import {fetchConversationByIdAndPage} from "./conversation-slice";

interface SubjectState {
    subjectListDisplay: SubjectType[];
    subjectListForFolder: SubjectType[];
    currentSubjectDisplayWithAllRelatedData: SubjectType | null;
    status: StatusEnum;
    error: ErrorType;
}

const initialState: SubjectState = {
    subjectListDisplay: [] as SubjectType[],
    subjectListForFolder: [] as SubjectType[],
    currentSubjectDisplayWithAllRelatedData: null,
    status: StatusEnum.IDLE,
    error: {} as ErrorType,
};

export const fetchSubjectByFolderId = createAsyncThunk(
    'items/fetchSubjectByFolderId',
    async (folderId: string, {rejectWithValue}) => {
        try {
            const response = await directus.items('subjects').readByQuery({
                filter: {
                    folder_id: {
                        _eq: folderId,
                    },
                },
                fields: subjectFields,
            });
            return response.data as SubjectType[];
        } catch (error: any) {
            return rejectWithValue({
                error: error.message,
                status: error.response.status,
            });
        }
    },
);

export const fetchSubjectByIdAndPage = createAsyncThunk(
    'items/fetchSubjectByIdAndPage',
    async (payload: PayloadFetchSubjectByIdAndPage, {rejectWithValue}) => {
        try {
            const response = await directus.items('subjects').readOne(payload.subjectId, {
                fields: subjectFields,
                deep: {
                    posts: {
                        _limit: 2,
                        _sort: '-date_created',
                        _page: payload.page,
                    }
                }
            });
            return response as SubjectType;
        } catch (error: any) {
            return rejectWithValue({
                error: error.message,
                status: error.response.status,
            });
        }
    },
);

export const fetchAllVisibleSubject = createAsyncThunk(
    'items/fetchAllVisibleSubject',
    async (_, {rejectWithValue}) => {
        try {
            const response = await directus.items('subjects').readByQuery({
                limit: -1,
                fields: subjectFields,
            });
            return response.data as SubjectType[];
        } catch (error: any) {
            return rejectWithValue({
                error: error.message,
                status: error.response.status,
            });
        }
    },
);

export const updatePostListAndRelatedResponseBySubjectId = createAsyncThunk(
    'items/updatePostListAndRelatedResponseBySubjectId',
    async (subjectId: string, {rejectWithValue}) => {
        try {
            const response = await directus.items('posts').readByQuery({
                filter: {
                    subject_id: {
                        _eq: subjectId,
                    },
                },
                fields: postFields,
            });
            return response.data as PostType[];
        } catch (error: any) {
            return rejectWithValue({
                error: error.message,
                status: error.response.status,
            });
        }
    },
);

export const createResponseToPost = createAsyncThunk(
    'items/createResponseToPost',
    async (payLoadMessage: PayLoadCreateSubjectMessage, {rejectWithValue}) => {
        try {
            const response = await directus.items('responses').createOne(
                {
                    post_id: payLoadMessage.post_id,
                    message: payLoadMessage.message,
                    file_id: payLoadMessage.file_id,
                },
                {
                    fields: responseFields,
                },
            );
            return response as ResponseType;
        } catch (error: any) {
            return rejectWithValue({
                error: error.message,
                status: error.response.status,
            });
        }
    },
);

export const createPostToSubject = createAsyncThunk(
    'items/createPostToSubject',
    async (payloadPost: PayLoadCreateSubjectPost, {rejectWithValue}) => {
        try {
            const response = await directus.items('posts').createOne(
                {
                    subject_id: payloadPost.subject_id,
                    title: payloadPost.title,
                    message: payloadPost.message,
                    file_id: payloadPost.file_id,
                    sondage_id: payloadPost.sondage_id,
                },
                {
                    fields: postFields,
                },
            );
            return response as PostType;
        } catch (error: any) {
            return rejectWithValue({
                error: error.message,
                status: error.response.status,
            });
        }
    },
);

export const updatePostMessageById = createAsyncThunk(
    'items/updatePostMessageById',
    async (payloadUpdatePost: PayLoadUpdateSubjectPost, {rejectWithValue}) => {
        try {
            const response = await directus.items('posts').updateOne(
                payloadUpdatePost.id,
                {
                    message: payloadUpdatePost.message,
                },
                {
                    fields: postFields,
                },
            );
            return response as PostType;
        } catch (error: any) {
            return rejectWithValue({
                error: error.message,
                status: error.response.status,
            });
        }
    },
);

export const updateResponseMessageById = createAsyncThunk(
    'items/updateResponseMessageById',
    async (payloadUpdateResponse: PayLoadUpdateSubjectResponse, {rejectWithValue}) => {
        try {
            const response = await directus.items('responses').updateOne(
                payloadUpdateResponse.id,
                {
                    message: payloadUpdateResponse.message,
                },
                {
                    fields: responseFields,
                },
            );
            return response as ResponseType;
        } catch (error: any) {
            return rejectWithValue({
                error: error.message,
                status: error.response.status,
            });
        }
    },
);

export const deletePostById = createAsyncThunk('items/deletePostById', async (postId: string, {rejectWithValue}) => {
    try {
        await directus.items('posts').deleteOne(postId);
    } catch (error: any) {
        return rejectWithValue({
            error: error.message,
            status: error.response.status,
        });
    }
});

export const deleteResponseById = createAsyncThunk(
    'items/deleteResponseById',
    async (responseId: string, {rejectWithValue}) => {
        try {
            await directus.items('responses').deleteOne(responseId);
        } catch (error: any) {
            return rejectWithValue({
                error: error.message,
                status: error.response.status,
            });
        }
    },
);

export const createSubjectWithUser = createAsyncThunk(
    'items/createSubjectWithUser',
    async (payLoadCreateSubject: PayLoadCreateSubject, { rejectWithValue }) => {
        try {
            const response = await directus.items('subjects').createOne(
                {
                    name: payLoadCreateSubject.name,
                    folder_id: payLoadCreateSubject.folderId,
                    user_list: payLoadCreateSubject.userList,
                },
                {
                    fields: subjectFields,
                },
            );
            return response as SubjectType;
        } catch (error: any) {
            return rejectWithValue({
                error: error.message,
                status: error.response.status,
            });
        }
    },
);

export const addUsersToSubject = createAsyncThunk(
    'items/addUsersToSubject',
    async (payLoadAddUserToSubject: PayLoadAddUserToSubject, { rejectWithValue }) => {
        try {
            const response = await directus.items('subjects').updateOne(
                payLoadAddUserToSubject.subjectId,
                {
                    user_list: payLoadAddUserToSubject.userList,
                },
                {
                    fields: subjectFields,
                },
            );
            return response as SubjectType;
        } catch (error: any) {
            return rejectWithValue({
                error: error.message,
                status: error.response.status,
            });
        }
    },
);

const subjectSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {
        setCurrentSubjectDisplay: (state, action) => {
            state.currentSubjectDisplayWithAllRelatedData = action.payload;
        },
        setCurrentSubjectDisplayWithAllRelatedData: (state, action) => {
            const foundSubject = state.subjectListDisplay.find(subject => subject.id === action.payload);
            if (foundSubject) {
                state.currentSubjectDisplayWithAllRelatedData = foundSubject;
            }
        },
        clearCurrentSubjectDisplayWithAllRelatedData: state => {
            state.currentSubjectDisplayWithAllRelatedData = {} as SubjectType;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchSubjectByFolderId.pending, state => {
                state.status = StatusEnum.LOADING;
                state.error = {} as ErrorType;
            })
            .addCase(fetchSubjectByFolderId.fulfilled, (state, action) => {
                state.status = StatusEnum.SUCCEEDED;
                state.subjectListForFolder = action.payload;
                state.error = {} as ErrorType;
            })
            .addCase(fetchSubjectByFolderId.rejected, (state, action) => {
                state.status = StatusEnum.FAILED;
                state.error = action.payload as ErrorType;
            })
            .addCase(fetchSubjectByIdAndPage.pending, state => {
                state.status = StatusEnum.LOADING;
                state.error = {} as ErrorType;
            })
            .addCase(fetchSubjectByIdAndPage.fulfilled, (state, action) => {
                state.status = StatusEnum.SUCCEEDED;
                if (state.currentSubjectDisplayWithAllRelatedData?.posts && action.payload.id === state.currentSubjectDisplayWithAllRelatedData.id) {
                    state.currentSubjectDisplayWithAllRelatedData.posts = [...state.currentSubjectDisplayWithAllRelatedData.posts, ...action.payload.posts];
                } else {
                    state.currentSubjectDisplayWithAllRelatedData = action.payload;
                }
                state.error = {} as ErrorType;
            })
            .addCase(fetchSubjectByIdAndPage.rejected, (state, action) => {
                state.status = StatusEnum.FAILED;
                state.error = action.payload as ErrorType;
            })
            .addCase(fetchAllVisibleSubject.pending, state => {
                state.status = StatusEnum.LOADING;
                state.error = {} as ErrorType;
            })
            .addCase(fetchAllVisibleSubject.fulfilled, (state, action) => {
                state.status = StatusEnum.SUCCEEDED;
                state.subjectListDisplay = action.payload as SubjectType[];
                state.error = {} as ErrorType;
            })
            .addCase(fetchAllVisibleSubject.rejected, (state, action) => {
                state.status = StatusEnum.FAILED;
                state.error = action.payload as ErrorType;
            })
            .addCase(updatePostListAndRelatedResponseBySubjectId.pending, state => {
                state.status = StatusEnum.LOADING;
                state.error = {} as ErrorType;
            })
            .addCase(updatePostListAndRelatedResponseBySubjectId.fulfilled, (state, action) => {
                state.status = StatusEnum.SUCCEEDED;
                state.error = {} as ErrorType;

                const subjectId = action.meta.arg;
                const newPosts = action.payload as PostType[];

                const subjectIndex = state.subjectListDisplay.findIndex(
                    (subject: SubjectType) => subject.id === subjectId,
                );

                if (subjectIndex !== -1) {
                    const oldPosts = state.subjectListDisplay[subjectIndex].posts as PostType[];
                    const mergedPosts = [
                        ...oldPosts,
                        ...newPosts.filter(
                            (newPost: PostType) => !oldPosts.some((oldPost: PostType) => oldPost.id === newPost.id),
                        ),
                    ];

                    state.subjectListDisplay = state.subjectListDisplay.map((subject, index) => {
                        if (index !== subjectIndex) {
                            return subject;
                        }
                        return {
                            ...subject,
                            posts: mergedPosts,
                        };
                    });
                }
            })
            .addCase(updatePostListAndRelatedResponseBySubjectId.rejected, (state, action) => {
                state.status = StatusEnum.FAILED;
                state.error = action.payload as ErrorType;
            })
            .addCase(createResponseToPost.pending, state => {
                state.status = StatusEnum.LOADING;
                state.error = {} as ErrorType;
            })
            .addCase(createResponseToPost.fulfilled, (state, action) => {
                state.status = StatusEnum.SUCCEEDED;
                state.error = {} as ErrorType;
            })
            .addCase(createResponseToPost.rejected, (state, action) => {
                state.status = StatusEnum.FAILED;
                state.error = action.payload as ErrorType;
            })
            .addCase(createPostToSubject.pending, state => {
                state.status = StatusEnum.LOADING;
                state.error = {} as ErrorType;
            })
            .addCase(createPostToSubject.fulfilled, (state, action) => {
                state.status = StatusEnum.SUCCEEDED;
                state.error = {} as ErrorType;
            })
            .addCase(createPostToSubject.rejected, (state, action) => {
                state.status = StatusEnum.FAILED;
                state.error = action.payload as ErrorType;
            })
            .addCase(updatePostMessageById.pending, state => {
                state.status = StatusEnum.LOADING;
                state.error = {} as ErrorType;
            })
            .addCase(updatePostMessageById.fulfilled, (state, action) => {
                state.status = StatusEnum.SUCCEEDED;
                state.error = {} as ErrorType;
            })
            .addCase(updatePostMessageById.rejected, (state, action) => {
                state.status = StatusEnum.FAILED;
                state.error = action.payload as ErrorType;
            })
            .addCase(deletePostById.pending, state => {
                state.status = StatusEnum.LOADING;
                state.error = {} as ErrorType;
            })
            .addCase(deletePostById.fulfilled, (state, action) => {
                state.status = StatusEnum.SUCCEEDED;
                const postId = action.meta.arg;
                state.subjectListDisplay = state.subjectListDisplay.map((subject: SubjectType) => {
                    if (subject.posts) {
                        return {
                            ...subject,
                            posts: (subject.posts as PostType[]).filter((post: PostType) => post.id !== postId),
                        };
                    }
                    return subject;
                });
                state.error = {} as ErrorType;
            })
            .addCase(deletePostById.rejected, (state, action) => {
                state.status = StatusEnum.FAILED;
                state.error = action.payload as ErrorType;
            })
            .addCase(deleteResponseById.pending, state => {
                state.status = StatusEnum.LOADING;
                state.error = {} as ErrorType;
            })
            .addCase(deleteResponseById.fulfilled, (state, action) => {
                state.status = StatusEnum.SUCCEEDED;
                const responseId = action.meta.arg;
                state.subjectListDisplay = state.subjectListDisplay.map((subject: SubjectType) => {
                    if (subject.posts) {
                        return {
                            ...subject,
                            posts: (subject.posts as PostType[]).map((post: PostType) => {
                                if (post.responses) {
                                    return {
                                        ...post,
                                        responses: (post.responses as ResponseType[]).filter(
                                            (response: ResponseType) => response.id !== responseId,
                                        ),
                                    };
                                }
                                return post;
                            }),
                        };
                    }
                    return subject;
                });
                state.error = {} as ErrorType;
            })
            .addCase(updateResponseMessageById.pending, state => {
                state.status = StatusEnum.LOADING;
                state.error = {} as ErrorType;
            })
            .addCase(updateResponseMessageById.fulfilled, (state, action) => {
                state.status = StatusEnum.SUCCEEDED;
                state.subjectListDisplay = state.subjectListDisplay.map((subject: SubjectType) => {
                    return {
                        ...subject,
                        posts: (subject.posts as PostType[]).map((post: PostType) => {
                            return {
                                ...post,
                                responses: (post.responses as ResponseType[]).map((response: ResponseType) => {
                                    if (response.id === action.payload.id) {
                                        return action.payload;
                                    }
                                    return response;
                                }),
                            };
                        }),
                    };
                });
                state.error = {} as ErrorType;
            })
            .addCase(updateResponseMessageById.rejected, (state, action) => {
                state.status = StatusEnum.FAILED;
                state.error = action.payload as ErrorType;
            })
            .addCase(createSubjectWithUser.pending, state => {
                state.status = StatusEnum.LOADING;
                state.error = {} as ErrorType;
            })
            .addCase(createSubjectWithUser.fulfilled, (state, action) => {
                state.status = StatusEnum.SUCCEEDED;
                state.subjectListDisplay = [...state.subjectListDisplay, action.payload];
                state.error = {} as ErrorType;
            })
            .addCase(createSubjectWithUser.rejected, (state, action) => {
                state.status = StatusEnum.FAILED;
                state.error = action.payload as ErrorType;
            })
            .addCase(addUsersToSubject.pending, state => {
                state.status = StatusEnum.LOADING;
                state.error = {} as ErrorType;
            })
            .addCase(addUsersToSubject.fulfilled, (state, action) => {
                state.status = StatusEnum.SUCCEEDED;
                state.subjectListDisplay = state.subjectListDisplay.map((subject: SubjectType) => {
                    if (subject.id === action.payload.id) {
                        return action.payload;
                    }
                    return subject;
                });
                state.error = {} as ErrorType;
            })
            .addCase(addUsersToSubject.rejected, (state, action) => {
                state.status = StatusEnum.FAILED;
                state.error = action.payload as ErrorType;
            });
    },
});

export default subjectSlice.reducer;
export const {setCurrentSubjectDisplay, setCurrentSubjectDisplayWithAllRelatedData, clearCurrentSubjectDisplayWithAllRelatedData} = subjectSlice.actions;
