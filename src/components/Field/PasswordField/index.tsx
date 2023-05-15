import { useState } from 'react';
import { EyeIcon } from '@heroicons/react/20/solid';
import { EyeSlashIcon } from '@heroicons/react/20/solid';

type PasswordFieldProps = {
    customKey: string;
    password: string;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    required: boolean;
    label: string;
    className?: string;
};

function PasswordField(props: PasswordFieldProps) {
    const { customKey, password, handleChange, required, label, className } =
        props;
    const [showPassword, setShowPassword] = useState(false);
    const inputType = showPassword ? 'text' : 'password';
    const handleClickShowPassword = () => setShowPassword(!showPassword);

    return (
        <>
            <div className="relative">
                <input
                    id={customKey}
                    name={customKey}
                    type={inputType}
                    value={password}
                    onChange={handleChange}
                    required={required}
                    placeholder={label}
                    className={className}
                />
                <button
                    tabIndex={-1}
                    type="button"
                    title="Show password"
                    onClick={handleClickShowPassword}
                >
                    {showPassword ? (
                        <EyeSlashIcon className="h-7 w-7 text-gray-500 hover:text-gray-900 -mx-10 absolute top-1/2 transform -translate-y-1/2" />
                    ) : (
                        <EyeIcon className="h-7 w-7 text-gray-500 hover:text-gray-900 -mx-10 absolute top-1/2 transform -translate-y-1/2" />
                    )}
                </button>
            </div>
        </>
    );
}

export default PasswordField;
