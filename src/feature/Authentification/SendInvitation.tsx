import { useState, useEffect } from 'react';
import { RoleType } from '@directus/sdk';
import EmailField from '../../components/Field/EmailField';
import CustomButtonWithValidation from '../../components/Field/CustomButtonWithValidation';
import { useAppDispatch, useAppSelector } from '../../App/hooks';
import { sendInvite } from '../../slicers/user/invite-slice';
import { InvitationType } from '../../types/Users/InvitationType';
import RoleSelection from '../../components/Users/RoleSelection';
import SettingForm from '../../components/Forms/SendInvitationForm';

export default function SendInvitation() {
    const dispatch = useAppDispatch();
    const { status, error } = useAppSelector(state => state.invitation);
    const [isValid, setIsValid] = useState(false);
    const [selectedRole, setSelectedRole] = useState<RoleType | undefined>();
    const [email, setEmail] = useState<string>('');
    const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
    const [isRoleValid, setIsRoleValid] = useState<boolean>(false);
    const formId = 'invitation-form';
    const [inputColor, setInputColor] = useState<string>('bg-blue-200 tablet:bg-blue-100');
    const errorMessages = {
        isEmailValid: 'Email is not valid',
        isRoleValid: 'Role is not valid',
    };

    useEffect(() => {
        setInputColor('bg-blue-200 tablet:bg-blue-100');
    }, [email]);

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handleSendInvitation = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isEmailValid && isRoleValid) {
            dispatch(
                sendInvite({
                    email: email,
                    roleId: selectedRole?.id,
                } as InvitationType),
            );
            setIsValid(true);
        } else {
            setIsValid(false);
            setInputColor('bg-red-200 tablet:bg-red-100');
        }
    };

    return (
        <SettingForm title="Invitation" description="Envoyer une invitation">
            <section className="">
                <form id={formId} onSubmit={handleSendInvitation}>
                    <EmailField
                        value={email}
                        handleChange={handleEmailChange}
                        label="Email : "
                        required={true}
                        setIsEmailValid={setIsEmailValid}
                        classNameInput={`mb-5 w-full text-gray-400 placeholder-inherit text-lg tablet:text-2xl rounded-lg p-1 tablet:p-2 border-2 border-transparent focus:border-blue-300 focus:outline-none ${inputColor}`}
                    />
                    <RoleSelection
                        selectedRole={selectedRole}
                        setSelectedRole={setSelectedRole}
                        setIsRoleValid={setIsRoleValid}
                        classNameSelection={`w-full bg-blue-100 border-blue-100 tablet:text-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 p-2 rounded-lg shadow-sm ${inputColor}`}
                    />
                    {isValid && <p className="mt-5 mb-5 text-sm text-green-500">Invitation envoyé</p>}
                    {!isValid && <p className="mt-5 mb-5 text-sm invisible">" "</p>}

                    <div className="text-center">
                        <CustomButtonWithValidation
                            type="submit"
                            disabled={false}
                            validationStates={{ isEmailValid, isRoleValid }}
                            errorMessages={errorMessages}
                            formId={formId}
                            classNameButton="w-3/5 tablet:mb-5 bg-blue-500 hover:bg-blue-600 text-white text-lg tablet:text-xl rounded-lg p-2 tablet:p-3 focus:outline-none"
                        >
                            Valider
                        </CustomButtonWithValidation>
                    </div>
                </form>
            </section>
        </SettingForm>
    );
}
