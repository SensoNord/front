type TextFieldProps = {
    customKey: string;
    value: string;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    required: boolean;
    label: string;
    className?: string;
};

function TextField(props: TextFieldProps) {
    const { value, handleChange, required, label, className, customKey } =
        props;

    return (
        <>
            <div>
                <input
                    className={className}
                    placeholder={label}
                    id={customKey}
                    name={customKey}
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
