import { useState } from 'react';
import { EyeIcon } from '@heroicons/react/20/solid';
import { EyeSlashIcon } from '@heroicons/react/20/solid';

type PasswordFieldProps = {
    customKey: string;
    name: string;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    required: boolean;
    label: string;
    className?: string;
};

export function NameField(props: PasswordFieldProps) {
    const { customKey, name, handleChange, required, label, className } =
        props;

   

    return (
        <>
            <div className="relative">
                <input
                    id={customKey}
                    name={customKey}
                    value={name}
                    onChange={handleChange}
                    required={required}
                    placeholder={label}
                    className={className}
                />               
            </div>
        </>
    );
}

export default NameField;
