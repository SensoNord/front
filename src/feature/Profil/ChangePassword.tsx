import { useState, useEffect } from 'react';
import { directus } from '../../libraries/directus';
import SettingForm from '../../components/Forms/SendInvitationForm';
import PasswordField from '../../components/Field/PasswordField';
import { useAppDispatch } from '../../App/hooks';
import { updateCurrentUserPassword } from '../../slicers/authentification/auth-slice';

export default function ChangePassword() {

    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [samePassword, setSamePassword] = useState(false);
    const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
    const [inputColor, setInputColor] = useState<string>('bg-blue-100 tablet:bg-blue-100');
    const dispatch = useAppDispatch();

    const handleInputNewPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(event.target.value);
    };

    const handleInputConfirmNewPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmNewPassword(event.target.value);
    };
    const isSamePassword = () => {
            setSamePassword(newPassword===confirmNewPassword);
        }

    useEffect(() => {
        setIsFormSubmitted(false);
        setInputColor('bg-blue-200 tablet:bg-blue-100');
        isSamePassword();
    }, [newPassword, confirmNewPassword]);

    const updatePassword = async (event: any) => {
        isSamePassword();
        setIsFormSubmitted(true);
        event.preventDefault();
        if (samePassword) {
            await dispatch(updateCurrentUserPassword(newPassword));
            setInputColor('bg-blue-100 tablet:bg-blue-100');
        } else {
            setInputColor('bg-red-200 tablet:bg-red-100');
        }
    };

    return (
        <div>
            <SettingForm title="Changer votre mot de passe">
       
                <div className="text-left">
                    <PasswordField
                        customKey="password-auth"
                        password={newPassword}
                        handleChange={handleInputNewPassword}
                        required
                        label="Nouveau mot de passe"
                        className={`mb-5 w-full text-gray-400 placeholder-inherit text-lg tablet:text-2xl rounded-lg p-1 tablet:p-2 border-2 border-transparent focus:border-blue-300 focus:outline-none ${inputColor}`}
                    />
                    <PasswordField
                        customKey="confirmpassword-auth"
                        password={confirmNewPassword}
                        handleChange={handleInputConfirmNewPassword}
                        required
                        label="Confirmer mot de passe"
                        className={`w-full text-gray-400 placeholder-inherit text-lg tablet:text-2xl rounded-lg p-1 tablet:p-2 border-2 border-transparent focus:border-blue-300 focus:outline-none ${inputColor}`}
                    />
                    {isFormSubmitted && !samePassword ? (
                            <p className="mt-4 mb-4 text-red-500 text-sm">Les mots de passes ne sont pas identiques</p>
                        ) : (
                            <>
                                {isFormSubmitted && samePassword && (
                                    <p className="mt-4 mb-4 text-green-500 text-sm">Votre mot de passe a bien été changé</p>
                                )}
                            </>
                        )}
                        {!isFormSubmitted && <p className="mt-4 mb-4 text-sm invisible">" "</p>}
                    <div className="text-center">
                        <button
                        onClick={updatePassword}
                            className="w-3/5 tablet:mb-5 bg-blue-500 hover:bg-blue-600 text-white text-lg tablet:text-xl rounded-lg p-2 tablet:p-3 focus:outline-none"
                          
                        >
                            Valider
                        </button>
                    </div>
                </div>
   
            </SettingForm>
        </div>
    );
}
