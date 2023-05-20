import { FC } from 'react';
import { Navigate } from 'react-router';
import { useAppSelector } from '../../App/hooks';
import { StatusEnum } from '../../types/Request/StatusEnum';
import { TokenType } from '../../types/Users/Credentials/TokenTypes';

const PrivateRoute: FC<{ children: React.ReactElement }> = ({ children }) => {
    const { token, isConnecting } = useAppSelector(state => state.auth);

    if (!token && isConnecting) {
        console.log(token, isConnecting)
        return <Navigate to="/login" />;
    }
    
    return children;
};

export default PrivateRoute;
