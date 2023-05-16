import React from 'react';

type EmailFieldProps = {
    value: string;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    required: boolean;
    label: string;
    classNameInput?: string;
    setIsEmailValid: React.Dispatch<React.SetStateAction<boolean>>;
};

function EmailField(props: EmailFieldProps) {
    const {
        value,
        handleChange,
        required,
        label,
        classNameInput,
        setIsEmailValid,
    } = props;

    function checkEmailValidity(email: string) {
        const emailPattern = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        return emailPattern.test(email);
    }

    function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
        const emailIsValid = checkEmailValidity(event.target.value);
        setIsEmailValid(emailIsValid);
        handleChange(event);
    }

    return (
        <>
            <input
                className={classNameInput}
                placeholder={label}
                id="email"
                name="email"
                type="email"
                value={value}
                onChange={handleEmailChange}
                required={required}
            />
        </>
    );
}

export default EmailField;
