import { h } from 'preact';
import { Callback } from '@base';

export interface INumberFieldProps {
  label: string;
  className?: string;
  name?: string;
  onChange?: Callback<KeyboardEvent>;
  value?: number;
}

const NumberField = ({ label, name, className, onChange, value }: INumberFieldProps) => {
  return (
    <span>
      <label>{ label }:</label>
      <input
        class={ className }
        name={ name }
        type="number"
        onKeyUp={ onChange }
        value={ value.toString() }
      />
    </span>
  );
};

export default NumberField;
