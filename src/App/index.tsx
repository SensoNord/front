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

function App() {
  return (
    <Provider store={store}>
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
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
