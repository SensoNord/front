import React from "react";

type Option = {
  value: string;
  label: string;
};

type SelectFieldProps = {
  options: Option[];
  value: string;
  handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  label: string;
};

function SelectField(props: SelectFieldProps) {
  const { options, value, handleChange, required, label } = props;

  return (
    <div>
      <label htmlFor="select-field">{label}</label>
      <select
        className="select-field"
        id="select-field"
        name="select"
        value={value}
        onChange={handleChange}
        required={required}
      >
        <option value="">Sélectionnez une option</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectField;
