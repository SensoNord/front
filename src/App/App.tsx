import './App.css';
import { Directus } from '@directus/sdk';

import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from '../feature/Login/PrivateRoute';
import Layout from '../components/Layout';
import { Login } from '../feature/Login';
import NotFoundPage from '../components/NotFoundPage';
import Home from '../feature/Home';
import { DirectusContext } from '../context/directus-context'
export default function App() {

  const directus = new Directus(process.env.REACT_APP_DIRECTUS_URL as string);
  
  return (
    <DirectusContext.Provider value={directus}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>}>
            <Route path="home" element={<Home />} />
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </DirectusContext.Provider>
  )
}
