import { useState } from 'react';
import { directus } from '../../libraries/directus';
import SettingForm from '../../components/Forms/SendInvitationForm';
import { NameField } from '../../components/Forms/ChangeNameForm';
import EmailField from '../../components/Field/EmailField';

function isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export default function ChangeEmail() {
    const [email, setEmail] = useState<string>('');
    const [isEmailValid, setIsEmailValid] = useState<boolean>(false);

    const [emailNotValid, setIsEmailNotValid] = useState(false);
    const [nouveauEmail, setNouveauEmail] = useState('');
    const [isEmailChanged, setIsNameChanged] = useState(false);
    const [isWrongInput, setIsWrongInput] = useState(false);
    const [validationSupplementaire, setValidationSupplementaire] =
        useState(false);
    const [validation, setValidation] = useState(true);
    const [inputColor, setInputColor] = useState<string>(
        'bg-blue-200 tablet:bg-blue-100',
    );

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handleValidationSupplementaire = async () => {
        if (nouveauEmail === '') {
            setIsWrongInput(true);
            setIsEmailNotValid(false);
        } else if (!isEmailValid(nouveauEmail)) {
            setIsEmailNotValid(true);
            setIsWrongInput(false);
        } else {
            setValidationSupplementaire(true);
            setValidation(false);
            setIsWrongInput(false);
            setIsEmailNotValid(false);
        }
    };
    const handleAnnuler = async () => {
        setValidation(true);
        setValidationSupplementaire(false);
        setNouveauEmail('');
    };
    const updateName = async () => {
        await directus.users.me.update({ email: nouveauEmail });
        setIsWrongInput(false);
        setNouveauEmail('');
        setIsNameChanged(true);
    };

    return (
        <div>
            <SettingForm title="Changer votre email">
                <div className="space-y-8 text-left">
                    <form id="email-form" onSubmit={updateName}>
                        <EmailField
                            value={email}
                            handleChange={handleEmailChange}
                            label="Email : "
                            required={true}
                            setIsEmailValid={setIsEmailValid}
                            classNameInput="w-full bg-blue-100 border-blue-300 tablet:text-2xl focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300 p-2 rounded-lg shadow-sm"
                        />

                        <button
                            type="submit"
                            className="w-3/5 bg-blue-500 hover:bg-blue-600 text-white tablet:text-2xl rounded-lg p-2 tablet:p-3 focus:outline-none"
                        >
                            Valider
                        </button>
                    </form>

                    {isEmailChanged && (
                        <p className="text-red-500 text-sm text-center">
                            Votre email a bien été changé
                        </p>
                    )}
                    {emailNotValid && (
                        <p className="text-red-500 text-sm text-center">
                            Veuillez renseigner une adresse mail valide
                        </p>
                    )}
                    {isWrongInput && (
                        <p className="text-red-500 text-sm first:text-center">
                            Veuillez ne pas laisser de champs vide
                        </p>
                    )}
                </div>
            </SettingForm>
        </div>
    );
}
