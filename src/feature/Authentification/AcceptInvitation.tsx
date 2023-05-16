import { useState } from 'react';
import PasswordField from '../../components/Field/PasswordField';

export default function AcceptInvitation() {
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const passwordFieldHandleChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => setPassword(event.target.value);

    const confirmPasswordFieldHandleChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => setConfirmPassword(event.target.value);

    const handleSubmit = (event: any) => {
        event.preventDefault();
    };

    return (
        <>
            <section>
                <div>
                    <h1>Accept invitation</h1>
                    <form onSubmit={handleSubmit}>
                        <PasswordField
                            customKey="password-invitation"
                            password={password}
                            handleChange={passwordFieldHandleChange}
                            required
                            label="Password"
                        />
                        <PasswordField
                            customKey="confirm-password-invitation"
                            password={confirmPassword}
                            handleChange={confirmPasswordFieldHandleChange}
                            required
                            label="Confirm Password"
                        />
                        <button type="submit">Accept</button>
                    </form>
                </div>
            </section>
        </>
    );
}
