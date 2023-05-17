import { FileType, FolderType } from '@directus/sdk';
import { StatusEnum } from '../types/Request/StatusEnum';
import { ErrorType } from '../types/Request/ErrorType';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { directus } from '../libraries/directus';

interface FolderState {
    actualFolder: FolderType;
    folderList: FolderType[];
    status: StatusEnum;
    error: ErrorType;
}

const initialState: FolderState = {
    actualFolder: {} as FolderType,
    folderList: [] as FolderType[],
    status: StatusEnum.IDLE,
    error: {} as ErrorType,
};

export const fetchFolderByParent = createAsyncThunk(
    'folder/fetchFolderByParent',
    async (parentId: string | null, { rejectWithValue }) => {
        console.log(parentId);
        try {
            const response = await directus.folders.readByQuery({
                filter: {
                    parent: parentId ? { _eq: parentId } : { _null: true },
                },
            });
            console.log(response);
            return response.data as Array<FolderType>;
        } catch (error: any) {
            return rejectWithValue({
                error: error.message,
                status: error.response.status,
            });
        }
    },
);

export const fetchFolderById = createAsyncThunk(
    'folder/fetchFolderById',
    async (folderId: string, { rejectWithValue }) => {
        try {
            const response = await directus.folders.readOne(folderId);
            return response as FolderType;
        } catch (error: any) {
            return rejectWithValue({
                error: error.message,
                status: error.response.status,
            });
        }
    },
);

const folderSlice = createSlice({
    name: 'folder',
    initialState,
    reducers: {
        setActualFolder: (state, action) => {
            state.status = StatusEnum.SUCCEEDED;
            state.actualFolder = action.payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchFolderByParent.pending, state => {
                state.status = StatusEnum.LOADING;
                state.error = {} as ErrorType;
            })
            .addCase(fetchFolderByParent.fulfilled, (state, action) => {
                state.status = StatusEnum.SUCCEEDED;
                state.folderList = action.payload as Array<FolderType>;
                state.error = {} as ErrorType;
            })
            .addCase(fetchFolderByParent.rejected, (state, action) => {
                state.status = StatusEnum.FAILED;
                state.error = action.payload as ErrorType;
            })
            .addCase(fetchFolderById.pending, state => {
                state.status = StatusEnum.LOADING;
                state.error = {} as ErrorType;
            })
            .addCase(fetchFolderById.fulfilled, (state, action) => {
                state.status = StatusEnum.SUCCEEDED;
                state.actualFolder = action.payload as FolderType;
                state.error = {} as ErrorType;
            })
            .addCase(fetchFolderById.rejected, (state, action) => {
                state.status = StatusEnum.FAILED;
                state.error = action.payload as ErrorType;
            });
    },
});

export const { setActualFolder } = folderSlice.actions;
export default folderSlice.reducer;
