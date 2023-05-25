import { FolderType } from '@directus/sdk';
import { StatusEnum } from '../../types/Request/StatusEnum';
import { ErrorType } from '../../types/Request/ErrorType';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { directus } from '../../libraries/directus';

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

export type folderByParentPayload = {
    parentId: string | null;
    connectedUserId: string | null;
};

export type PayloadCreateFolder = {
    name: string;
    parentId: string | undefined;
};

export const fetchFolderByParent = createAsyncThunk(
    'folder/fetchFolderByParent',
    async (folderByParentPayload: folderByParentPayload, { rejectWithValue }) => {
        try {
            const response = await directus.folders.readByQuery({
                filter: {
                    parent: folderByParentPayload.parentId ? { _eq: folderByParentPayload.parentId } : { _null: true },
                },
            });
            const result = [] as Array<FolderType>;
            const data = response.data as Array<FolderType>;
            if (folderByParentPayload.parentId)
                for (const folder of data) {
                    const response2 = await directus.items('subjects').readByQuery({
                        filter: {
                            folder_id: {
                                _eq: folder.id,
                            },
                        },
                        fields: ['id'],
                    });
                    if (response2.data?.length && response2.data.length > 0) {
                        result.push(folder);
                    }

                    const response3 = await directus.items('conversations').readByQuery({
                        filter: {
                            folder_id: {
                                _eq: folder.id,
                            },
                        },
                        fields: ['id'],
                    });
                    if (response3.data?.length && response3.data.length > 0) {
                        result.push(folder);
                    }
                }
            else result.push(...(data as Array<FolderType>));
            return result;
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

export const createFolder = createAsyncThunk(
    'folder/createFolder',
    async (payloadCreateFolder: PayloadCreateFolder, { rejectWithValue }) => {
        try {
            const response = await directus.folders.createOne({
                name: payloadCreateFolder.name,
                parent: payloadCreateFolder.parentId,
            });
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
                state.error = {} as ErrorType;
            })
            .addCase(fetchFolderById.rejected, (state, action) => {
                state.status = StatusEnum.FAILED;
                state.error = action.payload as ErrorType;
            })
            .addCase(createFolder.pending, state => {
                state.status = StatusEnum.LOADING;
                state.error = {} as ErrorType;
            })
            .addCase(createFolder.fulfilled, (state, action) => {
                state.status = StatusEnum.SUCCEEDED;
                state.error = {} as ErrorType;
                state.folderList.push(action.payload as FolderType);
            })
            .addCase(createFolder.rejected, (state, action) => {
                state.status = StatusEnum.FAILED;
                state.error = action.payload as ErrorType;
            });
    },
});

export const { setActualFolder } = folderSlice.actions;
export default folderSlice.reducer;
