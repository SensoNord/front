import { StatusEnum } from '../../types/Request/StatusEnum';
import { ErrorType } from '../../types/Request/ErrorType';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { directus } from '../../libraries/directus';
import { ModifiedFileType } from '../../types/File/ModifiedFileType';
import { AuthResult } from '@directus/sdk';

interface FileState {
    fileList: ModifiedFileType[];
    status: StatusEnum;
    error: ErrorType;
}

const initialState: FileState = {
    fileList: [] as ModifiedFileType[],
    status: StatusEnum.IDLE,
    error: {} as ErrorType,
};

export type UpdateFilePayload = {
    file: ModifiedFileType;
    chatType: 'subject' | 'conversation';
    chatId: string | null;
    folderId: string;
};

function getFormData(object: any) {
    const formData = new FormData();
    Object.keys(object).forEach(key => formData.append(key, object[key]));
    return formData;
}

export const fetchFileByFolder = createAsyncThunk(
    'file/fetchFileByFolder',
    async (folderId: string | null, { rejectWithValue }) => {
        try {
            const response = await directus.files.readByQuery({
                filter: {
                    folder: folderId ? { _eq: folderId } : { _null: true },
                },
            });
            return response.data as unknown as Array<ModifiedFileType>;
        } catch (error: any) {
            return rejectWithValue({
                error: error.message,
                status: error.response.status,
            });
        }
    },
);

export const fetchFileById = createAsyncThunk(
    'file/fetchFileById',
    async (fileId: string, { rejectWithValue }) => {
        try {
            const response = await directus.files.readOne(fileId);
            return response as unknown as ModifiedFileType;
        } catch (error: any) {
            return rejectWithValue({
                error: error.message,
                status: error.response.status,
            });
        }
    },
);

export const createFile = createAsyncThunk(
    'file/createFile',
    async (file: File, { rejectWithValue }) => {
        try {
            const formData = getFormData({ file });
            const response = await directus.files.createOne(formData);
            return response as unknown as ModifiedFileType;
        } catch (error: any) {
            return rejectWithValue({
                error: error.message,
                status: error.response.status,
            });
        }
    },
);

export const updateFile = createAsyncThunk(
    'file/updateFile',
    async (updateFilePayload: UpdateFilePayload, { rejectWithValue }) => {
        try {
            const chatType = updateFilePayload.chatType === 'subject' ? 'subjects_id' : 'conversations_id';
            const options =
                updateFilePayload.chatId !== null
                    ? {
                        [updateFilePayload.chatType]: [
                            { [chatType]: updateFilePayload.chatId },
                        ],
                        folder: updateFilePayload.folderId,
                    }
                    : { folder: updateFilePayload.folderId };
            const response = await directus.files.updateOne(
                updateFilePayload.file.id,
                options,
            );
            return response as unknown as ModifiedFileType;
        } catch (error: any) {
            return rejectWithValue({
                error: error.message,
                status: error.response.status,
            });
        }
    },
);

export const downloadFileWithoutURL = createAsyncThunk(
    'file/downloadFileWithoutURL',
    async (file: ModifiedFileType, { rejectWithValue, getState }) => {
        try {
            const state = getState() as any;
            const token = state.auth.token as AuthResult;
            const response = await fetch(
                `${process.env.REACT_APP_DIRECTUS_URL}/assets/${file.id}?download`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': file.type,
                        Authorization: 'Bearer ' + token.access_token,
                    },
                },
            );

            const blob = await response.blob();
            const newFile = new File([blob], file.filename_download as string, {
                type: file.type as string,
            });
            return newFile;
        } catch (error: any) {
            return rejectWithValue({
                error: error.message,
                status: error.response.status,
            });
        }
    },
);

export const downloadFile = createAsyncThunk(
    'file/downloadFile',
    async (file: ModifiedFileType, { rejectWithValue, getState }) => {
        try {
            const state = getState() as any;
            const token = state.auth.token as AuthResult;
            const response = await fetch(
                `${process.env.REACT_APP_DIRECTUS_URL}/assets/${file.id}?download`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': file.type,
                        Authorization: 'Bearer ' + token.access_token,
                    },
                },
            );

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', file.filename_download);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        } catch (error: any) {
            return rejectWithValue({
                error: error.message,
                status: error.response.status,
            });
        }
    },
);

export const deleteFileById = createAsyncThunk(
    'file/deleteFileById',
    async (fileId: string, { rejectWithValue }) => {
        try {
            await directus.files.deleteOne(fileId);
            return fileId;
        } catch (error: any) {
            return rejectWithValue({
                error: error.message,
                status: error.response.status,
            });
        }
    },
);

const fileSlice = createSlice({
    name: 'file',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchFileByFolder.pending, state => {
                state.status = StatusEnum.LOADING;
                state.error = {} as ErrorType;
            })
            .addCase(fetchFileByFolder.fulfilled, (state, action) => {
                state.status = StatusEnum.SUCCEEDED;
                state.fileList = action.payload as Array<ModifiedFileType>;
                state.error = {} as ErrorType;
            })
            .addCase(fetchFileByFolder.rejected, (state, action) => {
                state.status = StatusEnum.FAILED;
                state.error = action.payload as ErrorType;
            })
            .addCase(deleteFileById.pending, state => {
                state.status = StatusEnum.LOADING;
                state.error = {} as ErrorType;
            })
            .addCase(deleteFileById.fulfilled, (state, action) => {
                state.status = StatusEnum.SUCCEEDED;
                state.fileList = state.fileList.filter(
                    file => file.id !== action.payload,
                );
                state.error = {} as ErrorType;
            })
            .addCase(deleteFileById.rejected, (state, action) => {
                state.status = StatusEnum.FAILED;
                state.error = action.payload as ErrorType;
            })
            .addCase(createFile.pending, state => {
                state.status = StatusEnum.LOADING;
                state.error = {} as ErrorType;
            })
            .addCase(createFile.fulfilled, (state, action) => {
                state.status = StatusEnum.SUCCEEDED;
                state.fileList.push(action.payload);
                state.error = {} as ErrorType;
            })
            .addCase(createFile.rejected, (state, action) => {
                state.status = StatusEnum.FAILED;
                state.error = action.payload as ErrorType;
            })
            .addCase(updateFile.pending, state => {
                state.status = StatusEnum.LOADING;
                state.error = {} as ErrorType;
            })
            .addCase(updateFile.fulfilled, (state, action) => {
                state.status = StatusEnum.SUCCEEDED;
                state.fileList = state.fileList.map(file =>
                    file.id === action.payload.id ? action.payload : file,
                );
                state.error = {} as ErrorType;
            })
            .addCase(updateFile.rejected, (state, action) => {
                state.status = StatusEnum.FAILED;
                state.error = action.payload as ErrorType;
            })
            .addCase(downloadFileWithoutURL.pending, state => {
                state.status = StatusEnum.LOADING;
                state.error = {} as ErrorType;
            })
            .addCase(downloadFileWithoutURL.fulfilled, (state, action) => {
                state.status = StatusEnum.SUCCEEDED;
                state.error = {} as ErrorType;
            })
            .addCase(downloadFileWithoutURL.rejected, (state, action) => {
                state.status = StatusEnum.FAILED;
                state.error = action.payload as ErrorType;
            })
            .addCase(downloadFile.pending, state => {
                state.status = StatusEnum.LOADING;
                state.error = {} as ErrorType;
            })
            .addCase(downloadFile.fulfilled, (state, action) => {
                state.status = StatusEnum.SUCCEEDED;
                state.error = {} as ErrorType;
            })
            .addCase(downloadFile.rejected, (state, action) => {
                state.status = StatusEnum.FAILED;
                state.error = action.payload as ErrorType;
            })
            .addCase(fetchFileById.pending, state => {
                state.status = StatusEnum.LOADING;
                state.error = {} as ErrorType;
            })
            .addCase(fetchFileById.fulfilled, (state, action) => {
                state.status = StatusEnum.SUCCEEDED;
                state.error = {} as ErrorType;
                state.fileList = state.fileList.map(file =>
                    file.id === action.payload.id ? action.payload : file,
                );
            })
            .addCase(fetchFileById.rejected, (state, action) => {
                state.status = StatusEnum.FAILED;
                state.error = action.payload as ErrorType;
            });
    },
});

export default fileSlice.reducer;
