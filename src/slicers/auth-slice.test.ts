import { store } from '../App/store';
import { CredentialsType } from '../types/Users/Credentials/CredentialsType';
import { fetchLogin, loginWithToken, logout } from './auth-slice';

describe('Test authentication', () => {
  test('should handle loginWithToken', async () => {
    await store.dispatch(
      loginWithToken({ access_token: 'token', espires: '123' })
    );
    expect(store.getState().auth.token.access_token).toEqual('token');
  });

  test('should handle logout', async () => {
    await store.dispatch(
      loginWithToken({ access_token: 'token', espires: '123' })
    );
    expect(store.getState().auth.token.access_token).toEqual('token');
    await store.dispatch(logout());
    expect(store.getState().auth.token.access_token).toBeUndefined();
  });

  test('should handle test user connected', async () => {
    const credentials = {
      email: process.env.REACT_APP_EMAIL_TESTEUR,
      password: process.env.REACT_APP_PASSWORD_TESTEUR,
    } as CredentialsType;

    await store.dispatch(fetchLogin(credentials) as any);
    expect(store.getState().auth.token.access_token).not.toEqual('');
    expect(store.getState().auth.token.access_token).not.toBeUndefined();
    expect(store.getState().auth.status).toEqual('succeeded');
  });

  test('should handle failed login', async () => {
    const credentials = {
      email: 'test@gmail.com',
      password: '1234',
    } as CredentialsType;

    await store.dispatch(fetchLogin(credentials) as any);
    expect(store.getState().auth.token.access_token).toBeUndefined();
    expect(store.getState().auth.status).toEqual('failed');
  });
});
