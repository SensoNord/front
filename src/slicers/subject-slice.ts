// For testing purposes

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { directus } from '../libraries/directus';
import { ErrorType } from '../types/Request/ErrorType';
import { StatusEnum } from '../types/Request/StatusEnum';
import { SubjectType } from '../type/SubjectType';

interface SubjectState {
    subjectList: SubjectType[];
    status: StatusEnum;
    error: ErrorType;
}

const initialState: SubjectState = {
    subjectList: [] as SubjectType[],
    status: StatusEnum.IDLE,
    error: {} as ErrorType,
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

const subjectSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchSubjectByFolderId.pending, state => {
                state.status = StatusEnum.LOADING;
                state.error = {} as ErrorType;
            })
            .addCase(fetchSubjectByFolderId.fulfilled, (state, action) => {
                state.status = StatusEnum.SUCCEEDED;
                state.subjectList = action.payload;
                state.error = {} as ErrorType;
            })
            .addCase(fetchSubjectByFolderId.rejected, (state, action) => {
                state.status = StatusEnum.FAILED;
                state.error = action.payload as any;
            });
    },
});

export default subjectSlice.reducer;
