import { store } from "./store";
import { loginWithToken } from "../slicers/auth-slice";

describe("Middleware", () => {
  beforeEach(() => {
    store.dispatch(loginWithToken({ access_token: "token", expires: "123" }));
  });

  test("dispatches logout action when 401 error", () => {
    const action = {
      type: "some/action",
      payload: {
        status: 401,
      },
      error: "Unauthorized",
    };
    store.dispatch(action);
    expect(store.getState().auth.token).toBeNull;
  });

  test("does not dispatch logout action when other error", () => {
    const action = {
      type: "some/action",
      payload: {
        status: 500,
      },
      error: "Internal Server Error",
    };
    store.dispatch(action);
    expect(store.getState().auth.token.access_token).toEqual("token");
  });
});
