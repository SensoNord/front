import { useState } from 'react';
import { directus } from '../../libraries/directus';
import SettingForm from '../../components/Forms/SendInvitationForm';
import { NameField } from "../../components/Forms/ChangeNameForm";

export default function ChangeName() {

    const [nouveauFirstName, setNouveauFirstName] = useState('');
    const [nouveauLastName, setNouveauLastName] = useState('');
    const [isNameChanged, setIsNameChanged] = useState(false);
    const [isWrongInput, setIsWrongInput] = useState(false);


    const handleInputNouveauFirstName = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setNouveauFirstName(event.target.value);
    };

    const handleInputNouveauLastName = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setNouveauLastName(event.target.value);
    };

    const updateName = async () => {
        if (nouveauFirstName === '' || nouveauLastName === '') {
            setIsWrongInput(true);
            setIsNameChanged(false);
        }
        else {
            await directus.users.me.update({ first_name: nouveauFirstName });
            await directus.users.me.update({ last_name: nouveauLastName });
            setIsWrongInput(false);
            setNouveauFirstName('');
            setNouveauLastName('');
            setIsNameChanged(true);
        }

    }

    return (

        <div>
            <SettingForm
                title="Changer votre nom"
          
            ><div className='space-y-8 text-left'>

                    <NameField
                        customKey="new-firstname"
                        name={nouveauFirstName}
                        handleChange={handleInputNouveauFirstName}
                        required
                        label="Prénom"
                        className={`w-full bg-blue-100 border-blue-300 tablet:text-2xl focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300 p-2 rounded-lg shadow-sm`}
                    />
                    <NameField
                        customKey="new-firstname"
                        name={nouveauLastName}
                        handleChange={handleInputNouveauLastName}
                        required
                        label="Nom"
                        className={`w-full bg-blue-100 border-blue-300 tablet:text-2xl focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300 p-2 rounded-lg shadow-sm`}
                    />
                    <div className="text-center pt-5">
                        <button className='w-3/5 bg-blue-500 hover:bg-blue-600 text-white tablet:text-2xl rounded-lg p-2 tablet:p-3 focus:outline-none' onClick={updateName}>Valider</button>
                    </div>
                    {isNameChanged && (
                        <p className="text-red-500 text-center">Votre identité a bien été changé</p>
                    )}
                    {isWrongInput && (<p className="text-red-500 text-center">Veuillez ne pas laisser de champs vide </p>)}
                </div>
            </SettingForm>
        </div>
    );
}