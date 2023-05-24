import { useState } from 'react';
import { directus } from '../../libraries/directus';
import SettingForm from '../../components/Forms/SendInvitationForm';
import PasswordField from '../../components/Field/PasswordField';

export default function ChangePassword() {
    const [empty, setEmpty] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [wrongPassword, setWrongPassword] = useState(false);
    const [inputColor, setInputColor] = useState<string>(
        'bg-blue-100 tablet:bg-blue-100',
    );

    const handleInputNewPassword = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setNewPassword(event.target.value);
    };

    const handleInputConfirmNewPassword = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setConfirmNewPassword(event.target.value);
    };

    const updatePassword = async () => {
        setEmpty(false);
        setWrongPassword(false);
        if (newPassword !== confirmNewPassword) {
            setWrongPassword(true);
        } else if (newPassword === '' || confirmNewPassword === '') {
            setEmpty(true);
        } else {
            await directus.users.me.update({ password: newPassword });
        }
    };
    return (
        <div>
            <SettingForm title="Changer votre mot de passe">
                <div className="space-y-8 text-left">
                    <PasswordField
                        customKey="password-auth"
                        password={newPassword}
                        handleChange={handleInputNewPassword}
                        required
                        label="Votre nouveau mot de passe"
                        className={`w-full text-gray-400 placeholder-inherit text-lg tablet:text-2xl rounded-lg p-1 tablet:p-2 border-2 border-transparent focus:border-blue-300 focus:outline-none ${inputColor}`}
                    />
                    <PasswordField
                        customKey="password-auth"
                        password={confirmNewPassword}
                        handleChange={handleInputConfirmNewPassword}
                        required
                        label="Confirmer votre mot de passe"
                        className={`w-full text-gray-400 placeholder-inherit text-lg tablet:text-2xl rounded-lg p-1 tablet:p-2 border-2 border-transparent focus:border-blue-300 focus:outline-none ${inputColor}`}
                    />
                    <div className="text-center pt-5">
                        <button
                            className="w-3/5 bg-blue-500 hover:bg-blue-600 text-white tablet:text-2xl rounded-lg p-2 tablet:p-3 focus:outline-none"
                            onClick={updatePassword}
                        >
                            Valider
                        </button>
                    </div>
                    {empty && (
                        <p className="text-red-500 text-center">
                            Veuillez ne pas laisser de champs vide
                        </p>
                    )}
                    {wrongPassword && (
                        <p className="text-red-500 text-center">
                            L'un des champs est incorrect
                        </p>
                    )}
                </div>
            </SettingForm>
        </div>
    );
}
