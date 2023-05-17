// For testing purposes

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { directus } from '../libraries/directus';
import { ErrorType } from '../types/Request/ErrorType';
import { StatusEnum } from '../types/Request/StatusEnum';
import { SubjectType } from '../type/SubjectType';
import { PostType } from '../type/PostType';
import { MessageResponseType } from '../type/MessageResponseType';

interface SubjectState {
    subjectListDisplay: SubjectType[];
    subjectListForFolder: SubjectType[];
    currentSubjectDisplay: SubjectType | null;
    status: StatusEnum;
    error: ErrorType;
}

const initialState: SubjectState = {
    subjectListDisplay: [] as SubjectType[],
    subjectListForFolder: [] as SubjectType[],
    currentSubjectDisplay: null,
    status: StatusEnum.IDLE,
    error: {} as ErrorType,
};

type PayLoadMessage = {
    post_id: string;
    message: string;
    file_id: string | null;
};

export const fetchSubjectByFolderId = createAsyncThunk(
    'items/fetchSubjectByFolderId',
    async (folderId: string, { rejectWithValue }) => {
        try {
            const response = await directus.items('subjects').readByQuery({
                filter: {
                    folder_id: {
                        _eq: folderId,
                    },
                },
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

export const fetchAllVisibleSubjectAndRelatedPost = createAsyncThunk(
    'items/fetchAllVisibleSubject',
    async (_, { rejectWithValue }) => {
        try {
            const response = await directus.items('subjects').readByQuery({
                limit: -1,
                fields: [
                    'id',
                    'user_created.first_name',
                    'user_created.last_name',
                    'date_created',
                    'user_updated.first_name',
                    'user_updated.last_name',
                    'date_updated',
                    'name',
                    'user_list.directus_users_id.first_name',
                    'user_list.directus_users_id.last_name',
                    'posts.id',
                    'posts.user_created.first_name',
                    'posts.user_created.last_name',
                    'posts.user_created.id',
                    'posts.date_created',
                    'posts.user_updated.first_name',
                    'posts.user_updated.last_name',
                    'posts.date_updated',
                    'posts.title',
                    'posts.message',
                    'posts.file_id',
                    'posts.responses.user_created.first_name',
                    'posts.responses.user_created.last_name',
                    'posts.responses.user_created.id',
                    'posts.responses.date_created',
                    'posts.responses.user_updated.first_name',
                    'posts.responses.user_updated.last_name',
                    'posts.responses.date_updated',
                    'posts.responses.message',
                    'posts.responses.file_id',
                    'posts.responses.id',
                    'folder_id',
                ],
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

export const updatePostListBySubjectId = createAsyncThunk(
    'items/fetchPostBySubjectId',
    async (subjectId: string, { rejectWithValue }) => {
        try {
            const response = await directus.items('posts').readByQuery({
                filter: {
                    subject_id: {
                        _eq: subjectId,
                    },
                },
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
    'items/createResponseToPostWithPostId',
    async (payLoadMessage: PayLoadMessage, { rejectWithValue }) => {
        try {
            const response = await directus.items('responses').createOne({
                post_id: payLoadMessage.post_id,
                message: payLoadMessage.message,
                file_id: payLoadMessage.file_id,
            });
            return response as MessageResponseType;
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
            state.currentSubjectDisplay = action.payload;
        },
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
            .addCase(fetchAllVisibleSubjectAndRelatedPost.pending, state => {
                state.status = StatusEnum.LOADING;
                state.error = {} as ErrorType;
            })
            .addCase(
                fetchAllVisibleSubjectAndRelatedPost.fulfilled,
                (state, action) => {
                    state.status = StatusEnum.SUCCEEDED;
                    state.subjectListDisplay = action.payload as SubjectType[];
                    state.error = {} as ErrorType;
                },
            )
            .addCase(
                fetchAllVisibleSubjectAndRelatedPost.rejected,
                (state, action) => {
                    state.status = StatusEnum.FAILED;
                    state.error = action.payload as ErrorType;
                },
            )
            .addCase(updatePostListBySubjectId.pending, state => {
                state.status = StatusEnum.LOADING;
                state.error = {} as ErrorType;
            })
            .addCase(updatePostListBySubjectId.fulfilled, (state, action) => {
                state.status = StatusEnum.SUCCEEDED;
                state.error = {} as ErrorType;

                const subjectId = action.meta.arg;
                const newPosts = action.payload as PostType[];

                const subjectIndex = state.subjectListDisplay.findIndex(
                    (subject: SubjectType) => subject.id === subjectId,
                );

                if (subjectIndex !== -1) {
                    const oldPosts = state.subjectListDisplay[subjectIndex]
                        .posts as PostType[];
                    const mergedPosts = [
                        ...oldPosts,
                        ...newPosts.filter(
                            (newPost: PostType) =>
                                !oldPosts.some(
                                    (oldPost: PostType) =>
                                        oldPost.id === newPost.id,
                                ),
                        ),
                    ];

                    state.subjectListDisplay = state.subjectListDisplay.map(
                        (subject, index) => {
                            if (index !== subjectIndex) {
                                return subject;
                            }
                            return {
                                ...subject,
                                posts: mergedPosts,
                            };
                        },
                    );
                }
            })
            .addCase(updatePostListBySubjectId.rejected, (state, action) => {
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
            });
    },
});

export default subjectSlice.reducer;
export const { setCurrentSubjectDisplay } = subjectSlice.actions;
