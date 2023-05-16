import React, { useEffect, useState } from 'react';

type CustomButtonProps = {
    type: 'submit';
    disabled: boolean;
    validationStates: Record<string, boolean>;
    errorMessages: Record<string, string>;
    classNameButton?: string;
    children?: React.ReactNode;
    formId?: string;
};

export default function CustomButtonWithValidation(props: CustomButtonProps) {
    const {
        type,
        disabled,
        children,
        validationStates,
        errorMessages,
        classNameButton,
        formId,
    } = props;

    const [buttonClicked, setButtonClicked] = useState<boolean>(false);

    const handleClick = () => {
        setButtonClicked(true);
    };

    useEffect(() => {
        setButtonClicked(false);
    }, [validationStates]);

    return (
        <>
            <button
                type={type}
                disabled={disabled}
                onClick={handleClick}
                className={classNameButton}
                form={formId}
            >
                {children}
            </button>
            {buttonClicked &&
                Object.entries(validationStates).map(([key, isValid]) => {
                    if (!isValid) {
                        return <h3 key={key}>{errorMessages[key]}</h3>;
                    }
                    return null;
                })}
        </>
    );
}
