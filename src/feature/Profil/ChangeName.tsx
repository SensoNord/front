import { useState } from 'react';
import SettingForm from '../../components/Forms/SendInvitationForm';
import { useAppDispatch } from '../../App/hooks';
import { updateCurrentUserName } from '../../slicers/authentification/auth-slice';
import { UserInformationType } from '../../types/Users/UserInformationType';
import TextField from '../../components/Field/TextField';

export default function ChangeName() {
    const [nouveauFirstName, setNouveauFirstName] = useState('');
    const [nouveauLastName, setNouveauLastName] = useState('');
    const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
    const dispatch = useAppDispatch();

    const handleInputNouveauFirstName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNouveauFirstName(event.target.value);
    };

    const handleInputNouveauLastName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNouveauLastName(event.target.value);
    };

    const updateName = async (event: any) => {
        setIsFormSubmitted(true);
        event.preventDefault();
        await dispatch(
            updateCurrentUserName({
                first_name: nouveauFirstName,
                last_name: nouveauLastName,
            } as UserInformationType),
        );
    };

    return (
        <div>
            <SettingForm title="Nom" description="Changer votre nom">
                <form id="name-form" onSubmit={updateName}>
                    <TextField
                        customKey="new-firstname"
                        value={nouveauFirstName}
                        handleChange={handleInputNouveauFirstName}
                        required
                        label="Prénom"
                        className={`mb-5 w-full text-gray-400 placeholder-inherit text-lg tablet:text-2xl rounded-lg p-1 tablet:p-2 border-2 border-transparent focus:border-blue-300 focus:outline-none bg-blue-100 tablet:bg-blue-100`}
                    />
                    <TextField
                        customKey="new-lastname"
                        value={nouveauLastName}
                        handleChange={handleInputNouveauLastName}
                        required
                        label="Nom"
                        className={`w-full text-gray-400 placeholder-inherit text-lg tablet:text-2xl rounded-lg p-1 tablet:p-2 border-2 border-transparent focus:border-blue-300 focus:outline-none bg-blue-100 tablet:bg-blue-100`}
                    />

                    {isFormSubmitted && (
                        <p className="mt-4 mb-4 text-green-500 text-sm">Vos noms ont bien été changé</p>
                    )}

                    {!isFormSubmitted && <p className="mt-4 mb-4 text-sm invisible">" "</p>}
                    <div className="text-center">
                        <button
                            type="submit"
                            className=" w-3/5 tablet:mb-5 bg-blue-500 hover:bg-blue-600 text-white text-lg tablet:text-xl rounded-lg p-2 tablet:p-3 focus:outline-none"
                        >
                            Valider
                        </button>
                    </div>
                </form>
            </SettingForm>
        </div>
    );
}
