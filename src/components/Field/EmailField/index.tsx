import React, { useState } from "react";

type EmailFieldProps = {
  value: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required: boolean;
  label: string;
};

function EmailField(props: EmailFieldProps) {
  const { value, handleChange, required, label } = props;
  const [isValid, setIsValid] = useState(true);

  function checkEmailValidity(email: string) {
    const emailPattern = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return emailPattern.test(email);
  }

  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    const emailIsValid = checkEmailValidity(event.target.value);
    setIsValid(emailIsValid);
    handleChange(event);
  }

  return (
    <>
      <div>
        <input
          className={`input-box ${!isValid ? "input-box-invalid" : ""}`}
          placeholder={label}
          id="email"
          name="email"
          type="email"
          value={value}
          onChange={handleEmailChange}
          required={required}
        />
        {!isValid && <p className="email-error-message">Email invalide</p>}
      </div>
    </>
  );
}

export default EmailField;
