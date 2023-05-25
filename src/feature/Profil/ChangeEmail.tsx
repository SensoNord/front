import { useEffect, useState } from 'react';
import SettingForm from '../../components/Forms/SendInvitationForm';
import EmailField from '../../components/Field/EmailField';
import { useAppDispatch } from '../../App/hooks';
import { updateCurrentUserEmail } from '../../slicers/authentification/auth-slice';

export default function ChangeEmail() {
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState<string>('');
    const [confirmEmail, setConfirmEmail] = useState<string>('');
    const [isEmailValid, setIsEmailValid] = useState<boolean>(false);

    // eslint-disable-next-line
    const [isConfirmEmailValid, setIsConfirmEmailValid] = useState<boolean>(false);
    const [isEmailSame, setIsEmailSame] = useState<boolean>(false);
    const [isEmailChanged, setIsEmailChanged] = useState(false);
    useState(false);
    const [inputColor, setInputColor] = useState<string>('bg-blue-200 tablet:bg-blue-100');
    const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handleConfirmEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmEmail(event.target.value);
    };

    useEffect(() => {
        setIsFormSubmitted(false);
        setInputColor('bg-blue-200 tablet:bg-blue-100');
        isEmailAndConfirmEmailSame();
        // eslint-disable-next-line
    }, [email, confirmEmail]);

    const isEmailAndConfirmEmailSame = () => {
        if (email === confirmEmail) {
            setIsEmailSame(true);
        }
    };

    const updateEmail = async (event: any) => {
        setIsFormSubmitted(true);
        isEmailAndConfirmEmailSame();
        event.preventDefault();
        if (isEmailValid && isEmailSame) {
            setIsEmailChanged(true);
            await dispatch(updateCurrentUserEmail(email.trim()));
        } else {
            setInputColor('bg-red-200 tablet:bg-red-100');
        }
    };

    return (
        <div>
            <SettingForm title="Email" description="Changer votre email">
                <>
                    <form id="password-form" onSubmit={updateEmail}>
                        <EmailField
                            value={email}
                            handleChange={handleEmailChange}
                            label="Email"
                            required={true}
                            setIsEmailValid={setIsEmailValid}
                            classNameInput={`mb-5 w-full text-gray-400 placeholder-inherit text-lg tablet:text-2xl rounded-lg p-1 tablet:p-2 border-2 border-transparent focus:border-blue-300 focus:outline-none ${inputColor}`}
                        />
                        <EmailField
                            value={confirmEmail}
                            handleChange={handleConfirmEmailChange}
                            label="Confirmation"
                            required={true}
                            setIsEmailValid={setIsConfirmEmailValid}
                            classNameInput={`w-full text-gray-400 placeholder-inherit text-lg tablet:text-2xl rounded-lg p-1 tablet:p-2 border-2 border-transparent focus:border-blue-300 focus:outline-none ${inputColor}`}
                        />
                        {isFormSubmitted && !isEmailSame ? (
                            <p className="mt-4 mb-4 text-red-500 text-sm">Les emails ne sont pas identiques</p>
                        ) : (
                            <>
                                {isFormSubmitted && !isEmailValid && (
                                    <p className="mt-4 mb-4 text-red-500 text-sm">
                                        Veuillez renseigner une adresse mail valide
                                    </p>
                                )}

                                {isFormSubmitted && isEmailChanged && (
                                    <p className="mt-4 mb-4 text-green-500 text-sm">Votre email a bien été changé</p>
                                )}
                            </>
                        )}
                        {!isFormSubmitted && <p className="mt-4 mb-4 text-sm invisible">" "</p>}
                        <button
                            type="submit"
                            className="w-3/5 tablet:mb-5 bg-blue-500 hover:bg-blue-600 text-white text-lg tablet:text-xl rounded-lg p-2 tablet:p-3 focus:outline-none"
                        >
                            Valider
                        </button>
                    </form>
                </>
            </SettingForm>
        </div>
    );
}
