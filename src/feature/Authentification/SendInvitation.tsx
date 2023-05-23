import { useState } from 'react';
import { RoleType } from '@directus/sdk';
import EmailField from '../../components/Field/EmailField';
import CustomButtonWithValidation from '../../components/Field/CustomButtonWithValidation';
import { useAppDispatch, useAppSelector } from '../../App/hooks';
import { sendInvite } from '../../slicers/user/invite-slice';
import { InvitationType } from '../../types/Users/InvitationType';
import RoleSelection from '../../components/Users/RoleSelection';
import SendInvitationForm from '../../components/Forms/SendInvitationForm';

export default function SendInvitation() {
    const dispatch = useAppDispatch();
    const { status, error } = useAppSelector(state => state.invitation);
    const [selectedRole, setSelectedRole] = useState<RoleType | undefined>();
    const [email, setEmail] = useState<string>('');
    const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
    const [isRoleValid, setIsRoleValid] = useState<boolean>(false);
    const formId = 'invitation-form';

    const errorMessages = {
        isEmailValid: 'Email is not valid',
        isRoleValid: 'Role is not valid',
    };

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
        }
    };

    return (
        <><SendInvitationForm
        title="Send Invitation"
        >
            <section className='flex justify-center text-center'>
            <form id={formId} onSubmit={handleSendInvitation}>
                <div className='space-y-8 text-left'>
                <EmailField
                    value={email}
                    handleChange={handleEmailChange}
                    label="Email: "
                    required={true}
                    setIsEmailValid={setIsEmailValid} 
                    classNameInput="w-full bg-blue-100 border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300 p-2 rounded-lg shadow-sm"                 
                />
                <RoleSelection
                    selectedRole={selectedRole}
                    setSelectedRole={setSelectedRole}
                    setIsRoleValid={setIsRoleValid} 
                    classNameSelection="w-full bg-blue-100 border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 p-2 rounded-lg shadow-sm"                   
                />
                
                <div className="text-center pt-8">
                <CustomButtonWithValidation
                    type="submit"
                    disabled={false}
                    validationStates={{ isEmailValid, isRoleValid }}
                    errorMessages={errorMessages}
                    formId={formId}
                    classNameButton='w-4/5 bg-blue-500 hover:bg-blue-600 text-white tablet:text-2xl rounded-lg p-2 tablet:p-3 focus:outline-none'
                    >
                    Send Invitation
                </CustomButtonWithValidation>
                </div>
                </div>
            </form>
            </section>
            </SendInvitationForm>
        </>
    );
}
