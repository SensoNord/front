import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import Layout from "../components/Layout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import PrivateRoute from "../pages/Login/PrivateRoute";
import { store } from "./store";
import Home2 from "../pages/Home2";

function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={
                        <PrivateRoute>
                            <Layout />
                        </PrivateRoute>
                    }>
                        <Route path="home" element={<Home />} />
                        <Route path="home2" element={<Home2 />} />
                    </Route>
                    <Route path="login" element={<Login />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </Provider>
    );
}

export default App;
