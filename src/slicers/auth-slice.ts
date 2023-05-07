import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { directus } from "../libraries/directus";
import { CredentialsType } from "../types/Users/Credentials/CredentialsType";
import { TokenType } from "../types/Users/Credentials/TokenTypes";
import { ErrorType } from "../types/Request/ErrorType";
import { StatusEnum } from "../types/Request/StatusEnum";

interface LoginState {
  token: TokenType;
  status: StatusEnum;
  error: ErrorType;
}

const initialState: LoginState = {
  token: {} as TokenType,
  status: StatusEnum.IDLE,
  error: {} as ErrorType,
};

export const fetchLogin = createAsyncThunk(
  "auth/fetchLogin",
  async (credentials: CredentialsType, { rejectWithValue }) => {
    try {
      const response = await directus.auth.login(credentials);
      return response;
    } catch (error: any) {
      return rejectWithValue({
        error: error.message,
        status: error.response.status,
      });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginWithToken: (state, action) => {
      state.status = StatusEnum.SUCCEEDED;
      state.token = action.payload;
    },
    logout: () => {
      localStorage.clear();
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogin.pending, (state) => {
        state.status = StatusEnum.LOADING;
        state.token = {} as TokenType;
        state.error = {} as ErrorType;
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.status = StatusEnum.SUCCEEDED;
        state.token = action.payload;
        state.error = {} as ErrorType;
      })
      .addCase(fetchLogin.rejected, (state, action) => {
        state.status = StatusEnum.FAILED;
        state.token = {} as TokenType;
        state.error = action.payload as any;
      });
  },
});

export const { logout, loginWithToken } = authSlice.actions;
export default authSlice.reducer;
