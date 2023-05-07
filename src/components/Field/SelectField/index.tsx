import React from 'react';

type Option = {
  value: any;
  label: string;
};

type SelectFieldProps = {
  options: Option[];
  value: string;
  handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  label: string;
  className?: string;
};

function SelectField(props: SelectFieldProps) {
  const { options, value, handleChange, required, label, className } = props;

  return (
    <div>
      <label htmlFor="select-field">{label}</label>
      <select
        className={className}
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
