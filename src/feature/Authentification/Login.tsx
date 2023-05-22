import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../App/hooks';
import PasswordField from '../../components/Field/PasswordField';
import TextField from '../../components/Field/TextField';
import {
    fetchConnectedUser,
    fetchConnectedUserRole,
    fetchLogin,
    setIsConnecting,
} from '../../slicers/authentification/auth-slice';
import { CredentialsType } from '../../types/Users/CredentialsType';
import { StatusEnum } from '../../types/Request/StatusEnum';
import AuthentificationForm from '../../components/Forms/AuthentificationForm';

export default function Login() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [inputColor, setInputColor] = useState<string>(
        'bg-blue-200 tablet:bg-blue-100',
    );
    const formId = 'login-form';

    const textFieldHandleChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => setEmail(event.target.value);
    const passwordFieldHandleChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => setPassword(event.target.value);
    const { status, isConnecting } = useAppSelector(state => state.auth);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setIsConnecting(true));
    }, [dispatch]);

    const fetchUserData = useCallback(async () => {
        await dispatch(fetchConnectedUser());
        await dispatch(fetchConnectedUserRole());
        navigate('/');
    }, [dispatch, navigate]);

    useEffect(() => {
        switch (status) {
            case StatusEnum.IDLE || StatusEnum.LOADING:
                setInputColor('bg-blue-200 tablet:bg-blue-100');
                break;
            case StatusEnum.SUCCEEDED:
                setInputColor('bg-blue-200 tablet:bg-blue-100');
                fetchUserData();
                break;
            case StatusEnum.FAILED:
                setInputColor('bg-red-200 tablet:bg-red-100');
                break;
            default:
                setInputColor('bg-blue-200 tablet:bg-blue-100');
                break;
        }
    }, [status, navigate, isConnecting, dispatch, fetchUserData]);

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const credentials: CredentialsType = {
            email,
            password,
        };
        await dispatch(fetchLogin(credentials));
    };

    return (
        <AuthentificationForm
            title="Connexion"
            description="Connectez-vous pour accéder à votre espace"
        >
            <form id={formId} onSubmit={handleSubmit}>
                <TextField
                    customKey="email-auth"
                    value={email}
                    handleChange={textFieldHandleChange}
                    required
                    label="Username"
                    className={`mb-5 w-4/5 placeholder-inherit text-lg tablet:text-xl rounded-lg p-1 tablet:p-2 border-2 border-transparent focus:border-blue-300 focus:outline-none ${inputColor}`}
                />
                <PasswordField
                    customKey="password-auth"
                    password={password}
                    handleChange={passwordFieldHandleChange}
                    required
                    label="Password"
                    className={`w-4/5 placeholder-inherit text-lg tablet:text-xl rounded-lg p-1 tablet:p-2 border-2 border-transparent focus:border-blue-300 focus:outline-none ${inputColor}`}
                />
                {status === StatusEnum.FAILED ? (
                    <p className="mt-4 mb-4 text-red-500 text-sm">
                        Les informations de connexion sont incorrectes
                    </p>
                ) : (
                    <p className="mt-4 mb-4 text-sm invisible">
                        Les informations de connexion sont incorrectes
                    </p>
                )}
                <button
                    type="submit"
                    className="w-3/5 mb-3 tablet:mb-5 bg-blue-500 hover:bg-blue-600 text-white text-lg tablet:text-xl rounded-lg p-2 tablet:p-3 focus:outline-none"
                >
                    Connexion
                </button>
            </form>
        </AuthentificationForm>
    );
}
