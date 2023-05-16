import { useState } from 'react';
import { RoleType } from '@directus/sdk';
import EmailField from '../../components/Field/EmailField';
import CustomButtonWithValidation from '../../components/Field/CustomButtonWithValidation';
import { useAppDispatch, useAppSelector } from '../../App/hooks';
import { sendInvite } from '../../slicers/invite-slice';
import { InvitationType } from '../../types/Users/InvitationType';
import RoleSelection from '../../components/Users/RoleSelection';

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
        <>
            <h1>Send Invitation</h1>
            <form id={formId} onSubmit={handleSendInvitation}>
                <EmailField
                    value={email}
                    handleChange={handleEmailChange}
                    label="Email: "
                    required={true}
                    setIsEmailValid={setIsEmailValid}
                />
                <RoleSelection
                    selectedRole={selectedRole}
                    setSelectedRole={setSelectedRole}
                    setIsRoleValid={setIsRoleValid}
                />
                <CustomButtonWithValidation
                    type="submit"
                    disabled={false}
                    validationStates={{ isEmailValid, isRoleValid }}
                    errorMessages={errorMessages}
                    formId={formId}
                >
                    Send Invitation
                </CustomButtonWithValidation>
            </form>
            <h3>{status}</h3>
            <h3>{error.error}</h3>
        </>
    );
}
