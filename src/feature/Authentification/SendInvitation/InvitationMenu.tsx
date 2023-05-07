import { useState } from 'react';
import RoleSelection from './RoleSelection';
import { RoleType } from '@directus/sdk';
import EmailField from '../../../components/Field/EmailField';
import CustomButton from '../../../components/Field/CustomButton';

export default function InvitationMenu() {
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
    console.log(email, selectedRole);
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
        <CustomButton
          type="submit"
          disabled={false}
          validationStates={{ isEmailValid, isRoleValid }}
          errorMessages={errorMessages}
          formId={formId}
        >
          Send Invitation
        </CustomButton>
      </form>
    </>
  );
}
