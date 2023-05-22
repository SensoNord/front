import JSConfetti from 'js-confetti';
import { useCallback, useEffect, useState } from 'react';
import AuthentificationForm from '../../components/Forms/AuthentificationForm';
import TextField from '../../components/Field/TextField';
import { CredentialsType } from '../../types/Users/CredentialsType';
import { useAppDispatch, useAppSelector } from '../../App/hooks';
import {
    fetchLogin,
    updateCurrentUser,
} from '../../slicers/authentification/auth-slice';
import { StatusEnum } from '../../types/Request/StatusEnum';
import { useNavigate } from 'react-router';
import { UserInformationType } from '../../types/Users/UserInformationType';
import PasswordField from '../../components/Field/PasswordField';

type AboutProps = {
    isInsriptionSuccess: boolean;
    password: string;
    setPassword: (password: string) => void;
};

export const About = (props: AboutProps) => {
    const { isInsriptionSuccess, password, setPassword } = props;

    const [firstname, setFirstname] = useState<string>('');
    const [lastname, setLastname] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const dispatch = useAppDispatch();
    const { status } = useAppSelector(state => state.auth);
    const [inputColor, setInputColor] = useState<string>(
        'bg-blue-200 tablet:bg-blue-100',
    );
    const navigate = useNavigate();

    const firstnameFieldHandleChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => setFirstname(event.target.value);

    const lastnameFieldHandleChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => setLastname(event.target.value);

    const emailFieldHandleChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => setEmail(event.target.value);

    const passwordFieldHandleChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => setPassword(event.target.value);

    const CONFETTI_ARGS = [
        {},
        { confettiRadius: 12, confettiNumber: 100 },
        { emojis: ['🌈', '⚡️', '💥', '✨', '💫', '🌸'] },
        { emojis: ['⚡️', '💥', '✨', '💫'] },
        {
            confettiColors: [
                '#ffbe0b',
                '#fb5607',
                '#ff006e',
                '#8338ec',
                '#3a86ff',
            ],
            confettiRadius: 10,
            confettiNumber: 150,
        },
        {
            confettiColors: [
                '#9b5de5',
                '#f15bb5',
                '#fee440',
                '#00bbf9',
                '#00f5d4',
            ],
            confettiRadius: 6,
            confettiNumber: 300,
        },
    ];
    const jsConfetti = new JSConfetti();

    function generateRandomArrayElement(arr: any) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    const updateUserData = useCallback(async () => {
        await dispatch(
            updateCurrentUser({
                first_name: firstname,
                last_name: lastname,
            } as UserInformationType),
        );
    }, [dispatch, firstname, lastname]);

    useEffect(() => {
        switch (status) {
            case StatusEnum.IDLE || StatusEnum.LOADING:
                setInputColor('bg-blue-200 tablet:bg-blue-100');
                break;
            case StatusEnum.SUCCEEDED:
                setInputColor('bg-blue-200 tablet:bg-blue-100');
                updateUserData();
                navigate('/');
                break;
            case StatusEnum.FAILED:
                setInputColor('bg-red-200 tablet:bg-red-100');
                break;
            default:
                setInputColor('bg-blue-200 tablet:bg-blue-100');
                break;
        }
    }, [status, navigate, dispatch, updateUserData]);

    useEffect(() => {
        setInputColor('bg-blue-200 tablet:bg-blue-100');
    }, [email]);

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const credentials: CredentialsType = {
            email,
            password,
        };
        await dispatch(fetchLogin(credentials));
    };

    useEffect(() => {
        if (isInsriptionSuccess) {
            jsConfetti.addConfetti(generateRandomArrayElement(CONFETTI_ARGS));
        }
        // eslint-disable-next-line
    }, [isInsriptionSuccess]);

    return (
        <>
            <AuthentificationForm
                title="About"
                description="Parlez nous de vous !"
                information="Veuillez inscire le mail sur lequel vous avez reçu l'invitation"
            >
                <form onSubmit={handleSubmit}>
                    <TextField
                        customKey="email"
                        value={email}
                        handleChange={emailFieldHandleChange}
                        required
                        label="Email"
                        className={`mb-5 w-4/5 placeholder-inherit text-lg tablet:text-xl rounded-lg p-1 tablet:p-2 border-2 border-transparent focus:border-blue-300 focus:outline-none ${inputColor}`}
                    />
                    {!password && (
                        <div className="mb-5">
                            <PasswordField
                                customKey="password-auth"
                                password={password}
                                handleChange={passwordFieldHandleChange}
                                required
                                label="Password"
                                className={`w-4/5 placeholder-inherit text-lg tablet:text-xl rounded-lg p-1 tablet:p-2 border-2 border-transparent focus:border-blue-300 focus:outline-none ${inputColor}`}
                            />
                        </div>
                    )}
                    <TextField
                        customKey="firstname"
                        value={firstname}
                        handleChange={firstnameFieldHandleChange}
                        required
                        label="Prénom"
                        className={`mb-5 w-4/5 placeholder-inherit text-lg tablet:text-xl rounded-lg p-1 tablet:p-2 border-2 border-transparent focus:border-blue-300 focus:outline-none bg-blue-200 tablet:bg-blue-100`}
                    />
                    <TextField
                        customKey="firstname"
                        value={lastname}
                        handleChange={lastnameFieldHandleChange}
                        required
                        label="Nom"
                        className={`w-4/5 placeholder-inherit text-lg tablet:text-xl rounded-lg p-1 tablet:p-2 border-2 border-transparent focus:border-blue-300 focus:outline-none bg-blue-200 tablet:bg-blue-100`}
                    />
                    {status === StatusEnum.FAILED ? (
                        <p className="mt-4 mb-4 text-red-500 text-sm">
                            {status === StatusEnum.FAILED && !password
                                ? 'Une erreur est survenue, veuillez inscrire le mot de passe précédant'
                                : "L'email inscrit est invalide"}
                        </p>
                    ) : (
                        <p className="mt-4 mb-4 text-sm invisible">""</p>
                    )}
                    <button
                        type="submit"
                        className="w-3/5 mb-3 tablet:mb-5 bg-blue-500 hover:bg-blue-600 text-white text-lg tablet:text-xl rounded-lg p-2 tablet:p-3 focus:outline-none"
                    >
                        Valider
                    </button>
                </form>
            </AuthentificationForm>
        </>
    );
};
