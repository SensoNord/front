import { useState } from 'react';
import { directus } from '../../libraries/directus';
import SettingForm from '../../components/Forms/SendInvitationForm';
import { NameField } from "../../components/Forms/ChangeNameForm";

function isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

export default function ChangeEmail() {

    const [emailNotValid, setIsEmailNotValid] = useState(false);
    const [nouveauEmail, setNouveauEmail] = useState('');
    const [isEmailChanged, setIsNameChanged] = useState(false);
    const [isWrongInput, setIsWrongInput] = useState(false);
    const [validationSupplementaire, setValidationSupplementaire] = useState(false);
    const [validation, setValidation] = useState(true);


    const handleInputNouveauEmail = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setNouveauEmail(event.target.value);
    };
    const handleValidationSupplementaire = async () => {
        if (nouveauEmail === '') {
            setIsWrongInput(true);
            setIsEmailNotValid(false);
        }else if(!isEmailValid(nouveauEmail)){
            setIsEmailNotValid(true);
            setIsWrongInput(false);
        }
        else{
            setValidationSupplementaire(true);
            setValidation(false);
            setIsWrongInput(false);
            setIsEmailNotValid(false);
        }
        
    }
    const handleAnnuler = async () => {
        setValidation(true);    
        setValidationSupplementaire(false);
        setNouveauEmail('');
    }
    const updateName = async () => {
        if (nouveauEmail === '') {
            setIsWrongInput(true);
            setIsNameChanged(false);
        }
        else {
            await directus.users.me.update({ email: nouveauEmail });
            setIsWrongInput(false);
            setNouveauEmail('');
            setIsNameChanged(true);
        }

    }

    return (

        <div>
            <SettingForm
                title="Changer votre email"
          
            ><div className='space-y-8 text-left'>

                    <NameField
                        customKey="new-firstname"
                        name={nouveauEmail}
                        handleChange={handleInputNouveauEmail}
                        required
                        label="Nouvel email"
                        className={`w-full bg-blue-100 border-blue-300 tablet:text-2xl focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300 p-2 rounded-lg shadow-sm`}
                    />
                    {validation && (<div className="text-center pt-5">
                        <button className='w-3/5 bg-blue-500 hover:bg-blue-600 text-white tablet:text-2xl rounded-lg p-2 tablet:p-3 focus:outline-none' onClick={handleValidationSupplementaire}>Valider</button>
                    </div>)}
                    
                    {validationSupplementaire && (
                        <div>
                            <div className="text-center space-y-4 pt-5">
                                <p>Voulez-vous vraiment changer votre email ?</p>
                                <div className='flex justify-around'>
                                <button className='w-1/5 bg-blue-500 hover:bg-blue-600 text-white tablet:text-xl rounded-lg p-2 tablet:p-3 focus:outline-none' onClick={updateName}>Oui</button>
                        <button className='w-1/5 bg-blue-500 hover:bg-blue-600 text-white tablet:text-xl rounded-lg p-2 tablet:p-3 focus:outline-none' onClick={handleAnnuler}>Annuler</button>
                   
                                </div>
                        </div>
                                {isEmailChanged && (
                        <p className="text-red-500 text-center">Votre email a bien été changé</p>
                    )}
                        </div>
                    )}
                    {emailNotValid && (<p className="text-red-500 text-center">Veuillez renseigner une adresse mail valide</p>)}
                    {isWrongInput && (<p className="text-red-500 text-center">Veuillez ne pas laisser de champs vide</p>)}
                </div>
            </SettingForm>
        </div>
    );
}