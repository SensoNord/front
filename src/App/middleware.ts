import { Dispatch, Middleware, MiddlewareAPI } from "redux";
import { logout } from "../slicers/auth-slice";

export const errorMiddleware: Middleware =
  ({ dispatch }: MiddlewareAPI) =>
  (next: Dispatch) =>
  (action: any) => {
    try {
      if (action.error && action.payload.status === 401) {
        dispatch(logout());
      }
      return next(action);
    } catch (error) {
      return error;
    }
  };
