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
    const { type, disabled, children, validationStates, classNameButton, formId } = props;

    // eslint-disable-next-line
    const [buttonClicked, setButtonClicked] = useState<boolean>(false);

    const handleClick = () => {
        setButtonClicked(true);
    };

    useEffect(() => {
        setButtonClicked(false);
    }, [validationStates]);

    return (
        <>
            <button type={type} disabled={disabled} onClick={handleClick} className={classNameButton} form={formId}>
                {children}
            </button>
        </>
    );
}
