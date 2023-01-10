import { FC, useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { DirectusContext } from "../context/directus-context";

const PrivateRoute: FC<{ children: React.ReactElement }> = ({ children }) => {

    const directus = useContext(DirectusContext);

    const [authenticated, setAuthenticated] = useState(false);

	// Try to authenticate with token if exists
    useEffect(() => {

        async function getToken() {
            await directus.auth.token.then((token: any) => {
                console.log(token);
                setAuthenticated(true);
            }).catch(() =>
                setAuthenticated(false)
            )   
        }
        getToken();
    }, [directus.auth.token]);

	// Let's login in case we don't have token or it is invalid / expired
	if (!authenticated) {
        console.log(authenticated)
        console.log('not authenticated')
        return <Navigate to="/login" />;
	}

    return children;
 };

export default PrivateRoute;