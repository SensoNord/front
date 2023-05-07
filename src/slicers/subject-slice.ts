// For testing purposes

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { directus } from '../libraries/directus';
import { ErrorType } from '../types/Request/ErrorType';
import { StatusEnum } from '../types/Request/StatusEnum';

interface SubjectState {
  string: any;
  status: StatusEnum;
  error: ErrorType;
}

const initialState: SubjectState = {
  string: {} as any,
  status: StatusEnum.IDLE,
  error: {} as ErrorType,
};

export const fetchSubject = createAsyncThunk(
  'items/fetchSubject',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await directus.items('subjects').readOne(id);
      return response;
    } catch (error: any) {
      return rejectWithValue({
        error: error.message,
        status: error.response.status,
      });
    }
  },
);

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchSubject.pending, state => {
        state.status = StatusEnum.LOADING;
        state.string = {} as any;
        state.error = {} as ErrorType;
      })
      .addCase(fetchSubject.fulfilled, (state, action) => {
        state.status = StatusEnum.SUCCEEDED;
        state.string = action.payload;
        state.error = {} as ErrorType;
      })
      .addCase(fetchSubject.rejected, (state, action) => {
        state.status = StatusEnum.FAILED;
        state.string = {} as any;
        state.error = action.payload as any;
      });
  },
});

export default itemsSlice.reducer;
