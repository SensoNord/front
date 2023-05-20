import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Layout from '../components/Layout';
import Home from '../feature/Home';
import Login from '../feature/Authentification/Login';
import NotFound from '../feature/NotFound';
import PrivateRoute from '../feature/Authentification/PrivateRoute';
import { store } from './store';
import Home2 from '../feature/Home2';
import AcceptInvitation from '../feature/Authentification/AcceptInvitation';
import SendInvitation from '../feature/Authentification/SendInvitation';
import Drive from '../feature/Drive';
import Chat from '../feature/Chat/Chat';
import { useCallback, useEffect } from 'react';
import { useAppDispatch } from './hooks';
import { fetchConnectedUser, fetchConnectedUserRole, loginWithToken, setIsConnecting } from '../slicers/authentification/auth-slice';

function App() {
    return ( 
        <Provider store={store}>
            <AuthHandler />
        </Provider>
    );
}

function AuthHandler() {
    const dispatch = useAppDispatch();

    const loginCheck = useCallback(async (token: string | null, expires: string | null) => {
        if (!token || !expires) {
            dispatch(setIsConnecting(true));
            return;
        }
        dispatch(loginWithToken({ access_token: token, expires: expires }));
        await dispatch(fetchConnectedUser());
        await dispatch(fetchConnectedUserRole());
    }, [dispatch]);  // Ajoutez les dépendances ici si nécessaire.

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
                    <Route path="home" element={<Home />} />
                    <Route path="home2" element={<Home2 />} />
                    <Route
                        path="send-invitation"
                        element={<SendInvitation />}
                    />
                    <Route path="chat" element={<Chat />} />
                    <Route path="drive" element={<Drive />} />
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
