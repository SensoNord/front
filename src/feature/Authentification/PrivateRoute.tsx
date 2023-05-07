import { FC } from "react";
import { Navigate } from "react-router";
import { useAppSelector } from "../../App/hooks";
import { StatusEnum } from "../../types/Request/StatusEnum";

const PrivateRoute: FC<{ children: React.ReactElement }> = ({ children }) => {
    const { status } = useAppSelector(state => state.auth)
    
    if (!(status === StatusEnum.SUCCEEDED)) { 
        return <Navigate to="/login" />;
    }
    return children;
};

export default PrivateRoute;