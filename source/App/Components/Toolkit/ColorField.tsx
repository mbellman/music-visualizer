import '@styles/Toolkit/ColorField.less';

import { h, Component } from 'preact';
import { Callback } from '@base';
import Field from '@components/Toolkit/Field';

export interface IColorFieldProps {
  label: string;
  value?: string;
  onChange?: Callback<string>;
}

const ColorField = ({ label, value, onChange, ...props }: IColorFieldProps): JSX.Element => {
  return (
    <span>
      <label>{ label }:</label>
      <span className="color-field">
        <label>#</label>
        <Field
          type="text"
          value={ value }
          size={ 2 }
          maxLength={ 6 }
          onChange={ onChange }
        />
      </span>
    </span>
  );
};

export default ColorField;
