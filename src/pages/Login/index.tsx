import { useEffect, useState } from "react"
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../App/hooks";
import PasswordField from "../../components/Field/PasswordField";
import TextField from "../../components/Field/TextField";
import { fetchLogin } from "../../slicers/auth-slice";
import { CredentialsType } from "../../types/Credentials/CredentialsType";
import { StatusEnum } from "../../types/Request/StatusEnum";

export default function Login() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const textFieldHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value);
    const passwordFieldHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value);
    const { status, error } = useAppSelector(state => state.auth)
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (status === StatusEnum.SUCCEEDED) {
            navigate('/home');
        }
    }, [status, navigate])

    const handleSubmit = (event: any) => {

        event.preventDefault();
        const credentials: CredentialsType = {
            email,
            password
        };
        dispatch(fetchLogin(credentials));
    }

    return (
        <>
            <section>
                {/* Left Panel */}
            </section>
            {/* Right Panel */}
            <section>
                <div>
                    <h1> Login Account </h1>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            value={email}
                            handleChange={textFieldHandleChange}
                            required
                            label="Username"
                        />
                        <PasswordField
                            password={password}
                            handleChange={passwordFieldHandleChange}
                            required
                            label="Password"
                        />
                        <button type="submit">Login</button>
                    </form>
                    <h3>{status}</h3>
                    <h3>{error.error}</h3>
                </div>
            </section>
        </>
    )
}
