import { useState } from 'react'

type PasswordFieldProps = {
    password: string
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    required: boolean
    label: string
}

function PasswordField(props: PasswordFieldProps) {
    const { password, handleChange, required, label } = props;
    const [showPassword, setShowPassword] = useState(false)
    const inputType = showPassword ? 'text' : 'password'
    const buttonLabel = showPassword ? 'Hide' : 'Show'
    const handleClickShowPassword = () => setShowPassword(!showPassword)

    return (
        <>
            <div>
                <input
                    id="password"
                    name="password"
                    type={inputType}
                    value={password}
                    onChange={handleChange}
                    required={required}
                    placeholder={label}
                />
                <button
                    type="button"
                    title="Show password"
                    onClick={handleClickShowPassword}
                >
                    {buttonLabel}
                </button>
            </div>
        </>
    );
};

export default PasswordField
