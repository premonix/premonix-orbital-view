import { useState, useEffect } from 'react';

interface StableInputProps {
  id: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  minLength?: number;
}

const StableInput = ({ 
  id, 
  type, 
  placeholder, 
  value, 
  onChange, 
  disabled = false, 
  required = false,
  minLength 
}: StableInputProps) => {
  // Internal state to prevent focus loss
  const [internalValue, setInternalValue] = useState(value);

  // Sync with external value when it changes
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange(newValue);
  };

  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={internalValue}
      onChange={handleChange}
      style={{
        width: '100%',
        height: '40px',
        padding: '8px 12px',
        backgroundColor: '#2a2a2a',
        color: '#ffffff',
        border: '1px solid rgba(100, 116, 139, 0.4)',
        borderRadius: '6px',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box'
      }}
      disabled={disabled}
      required={required}
      minLength={minLength}
    />
  );
};

export default StableInput;