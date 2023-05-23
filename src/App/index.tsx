import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Layout from '../components/Layout';
import Home from '../feature/Home';
import Login from '../feature/Authentification/Login';
import NotFound from '../feature/NotFound';
import PrivateRoute from '../feature/Authentification/PrivateRoute';
import { store } from './store';
import AcceptInvitation from '../feature/Authentification/AcceptInvitation';
import SendInvitation from '../feature/Authentification/SendInvitation';
import Drive from '../feature/Drive';
import Chat from '../feature/Chat/Chat';
import { useCallback, useEffect } from 'react';
import { useAppDispatch } from './hooks';
import {
    fetchConnectedUser,
    fetchConnectedUserRole,
    loginWithToken,
    setIsConnecting,
} from '../slicers/authentification/auth-slice';
import Calendar from '../feature/Calendar';
import Profil from '../feature/Profil';

function App() {
    return (
        <Provider store={store}>
            <AuthHandler />
        </Provider>
    );
}

function AuthHandler() {
    const dispatch = useAppDispatch();

    const loginCheck = useCallback(
        async (token: string | null, expires: string | null) => {
            if (!token || !expires) {
                dispatch(setIsConnecting(true));
                return;
            }
            dispatch(loginWithToken({ access_token: token, expires: expires }));
            await dispatch(fetchConnectedUser());
            await dispatch(fetchConnectedUserRole());
        },
        [dispatch],
    );

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        const expires = localStorage.getItem('auth_expires');
        loginCheck(token, expires);
    }, [dispatch, loginCheck]);

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <Layout />
                        </PrivateRoute>
                    }
                >
                    <Route path="/" element={<Home />} />
                    <Route path="chat" element={<Chat />} />
                    <Route path="calendar" element={<Calendar />} />
                    <Route path="drive" element={<Drive />} />
                    <Route
                        path="send-invitation"
                        element={<SendInvitation />}
                    />
                    <Route path="profil" element={<Profil />} />
                </Route>
                <Route path="login" element={<Login />} />
                <Route
                    path="accept-invitation"
                    element={<AcceptInvitation />}
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
