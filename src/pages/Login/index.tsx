import { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { DirectusContext } from "../../context/directus-context";


export function Login() {
    const directus = useContext(DirectusContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navagite = useNavigate()

    const handleChangeEmail = (event: any) => {
        console.log(event.target.value);
        setEmail(event.target.value);
    }

    const handleChangePassword = (event: any) => {
        console.log(event.target.value);
        setPassword(event.target.value);
    }

    async function handleSumbit(event: any) {
        event.preventDefault();
        await directus.auth
            .login({ email, password })
            .then(() => {
                navagite('/home')
            })
            .catch(() => {
                console.log('Invalid')
            });
    }

    useEffect(() => {
        async function refreshToken() {
            await directus.auth
            .refresh()
            .then(() => {
                console.log('refreshed')
            })
            .catch(() => {});
        }
        refreshToken()
    }, [directus.auth]);

    return (  
        <div>
            <h1>Authentification</h1>
            <form onSubmit={handleSumbit}>
                <input
                    type="text"
                    value={email}
                    onChange={handleChangeEmail}
                >
                </input>
                <input
                    type="password"
                    value={password}
                    onChange={handleChangePassword}
                >
                </input>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}