import { useEffect, useState } from 'react';
import PasswordField from '../../components/Field/PasswordField';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../App/hooks';
import AuthentificationForm from '../../components/Forms/AuthentificationForm';
import { StatusEnum } from '../../types/Request/StatusEnum';
import { acceptInvite } from '../../slicers/user/invite-slice';
import { AcceptInvitationType } from '../../types/Users/AcceptInvitationType';
import { About } from './About';

export default function AcceptInvitation() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { token } = useAppSelector(state => state.auth);
    const { status: statusUser } = useAppSelector(state => state.auth);
    const { status, error } = useAppSelector(state => state.invitation);
    const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
    const [isErrorDisplayable, setIsErrorDisplayable] =
        useState<boolean>(false);
    const [isInscriptionSuccess, setIsInscriptionSuccess] =
        useState<boolean>(false);

    const [inputColor, setInputColor] = useState<string>(
        'bg-blue-200 tablet:bg-blue-100',
    );

    const query = new URLSearchParams(location.search);
    const invitationToken = query.get('token');

    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const passwordFieldHandleChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => setPassword(event.target.value);

    const confirmPasswordFieldHandleChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => setConfirmPassword(event.target.value);

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        if (password === confirmPassword) {
            setIsPasswordValid(true);
            await dispatch(
                acceptInvite({
                    password: password,
                    token: invitationToken,
                } as AcceptInvitationType),
            );
        } else {
            setIsPasswordValid(false);
            setInputColor('bg-red-200 tablet:bg-red-100');
            setIsErrorDisplayable(true);
        }
    };

    useEffect(() => {
        setInputColor('bg-blue-200 tablet:bg-blue-100');
        setIsErrorDisplayable(false);
    }, [password, confirmPassword]);

    useEffect(() => {
        switch (status) {
            case StatusEnum.IDLE || StatusEnum.LOADING:
                setInputColor('bg-blue-200 tablet:bg-blue-100');
                break;
            case StatusEnum.SUCCEEDED:
                setInputColor('bg-blue-200 tablet:bg-blue-100');
                setIsInscriptionSuccess(true);
                break;
            case StatusEnum.FAILED:
                setInputColor('bg-red-200 tablet:bg-red-100');
                setIsErrorDisplayable(true);
                break;
            default:
                setInputColor('bg-blue-200 tablet:bg-blue-100');
                break;
        }
    }, [status]);

    useEffect(() => {
        setIsPasswordValid(true);
        if (token && statusUser === StatusEnum.SUCCEEDED) {
            navigate('/');
        } else if (!invitationToken) {
            navigate('/login');
        }
    }, [token, navigate, invitationToken, statusUser]);

    return (
        <>
            {isInscriptionSuccess ? (
                <About
                    isInsriptionSuccess={isInscriptionSuccess}
                    password={password}
                    setPassword={setPassword}
                />
            ) : (
                <AuthentificationForm
                    title="Création du compte"
                    description="Création du mot de passe de votre compte"
                >
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <PasswordField
                                customKey="password-invitation"
                                password={password}
                                handleChange={passwordFieldHandleChange}
                                required
                                label="Password"
                                className={`w-4/5 placeholder-inherit text-lg tablet:text-xl rounded-lg p-1 tablet:p-2 border-2 border-transparent focus:border-blue-300 focus:outline-none ${inputColor}`}
                            />
                        </div>
                        <PasswordField
                            customKey="confirm-password-invitation"
                            password={confirmPassword}
                            handleChange={confirmPasswordFieldHandleChange}
                            required
                            label="Confirm Password"
                            className={`w-4/5 placeholder-inherit text-lg tablet:text-xl rounded-lg p-1 tablet:p-2 border-2 border-transparent focus:border-blue-300 focus:outline-none ${inputColor}`}
                        />
                        {isErrorDisplayable &&
                        (status === StatusEnum.FAILED || !isPasswordValid) ? (
                            <p className="mt-4 mb-4 text-red-500 text-sm">
                                {!isPasswordValid &&
                                    'Les mots de passe ne correspondent pas'}
                                {isPasswordValid && error.error}
                            </p>
                        ) : (
                            <p className="mt-4 mb-4 text-sm invisible">""</p>
                        )}
                        <button
                            type="submit"
                            className="w-3/5 mb-3 tablet:mb-5 bg-blue-500 hover:bg-blue-600 text-white text-lg tablet:text-xl rounded-lg p-2 tablet:p-3 focus:outline-none"
                        >
                            Inscription
                        </button>
                    </form>
                </AuthentificationForm>
            )}
        </>
    );
}
