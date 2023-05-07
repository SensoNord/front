import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { directus } from '../libraries/directus';
import { RoleType } from '@directus/sdk';
import { StatusEnum } from '../types/Request/StatusEnum';
import { ErrorType } from '../types/Request/ErrorType';

interface RoleState {
  roles: Array<RoleType>;
  status: StatusEnum;
  error: ErrorType;
}

const initialState: RoleState = {
  roles: [],
  status: StatusEnum.IDLE,
  error: {} as ErrorType,
};

export const fetchRoles = createAsyncThunk(
  'roles/fetchRoles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await directus.roles.readByQuery({
        limit: -1,
      });
      return response.data as Array<RoleType>;
    } catch (error: any) {
      return rejectWithValue({
        error: error.message,
        status: error.response.status,
      });
    }
  },
);

const roleSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchRoles.pending, state => {
        state.status = StatusEnum.LOADING;
        state.roles = [];
        state.error = {} as ErrorType;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.status = StatusEnum.SUCCEEDED;
        state.roles = action.payload;
        state.error = {} as ErrorType;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.status = StatusEnum.FAILED;
        state.roles = [];
        state.error = action.payload as any;
      });
  },
});

export default roleSlice.reducer;
