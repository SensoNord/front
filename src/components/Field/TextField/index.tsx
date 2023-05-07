type TextFieldProps = {
  value: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required: boolean;
  label: string;
};

function TextField(props: TextFieldProps) {
  const { value, handleChange, required, label } = props;

  return (
    <>
      <div>
        <input
          className="input-box"
          placeholder={label}
          id="text"
          name="text"
          type="text"
          value={value}
          onChange={handleChange}
          required={required}
        />
      </div>
    </>
  );
}

export default TextField;
