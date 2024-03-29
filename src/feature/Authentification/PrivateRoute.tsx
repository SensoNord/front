import { FC } from 'react';
import { Navigate } from 'react-router';
import { useAppSelector } from '../../App/hooks';

const PrivateRoute: FC<{ children: React.ReactElement }> = ({ children }) => {
    const { token, isConnecting } = useAppSelector(state => state.auth);

    if (!token && isConnecting) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default PrivateRoute;
