import { h, Component } from 'preact';
import { Bind, Callback, Override } from '@base';
import Field from '@components/Toolkit/Field';

export interface INumberFieldProps {
  label: string;
  value?: number | string;
  className?: string;
  name?: string;
  onChange?: Callback<number>;
  [prop: string]: any;
}

export default class NumberField extends Component<INumberFieldProps, any> {
  @Override
  public render (): JSX.Element {
    const { label, value, className, name, ref, onChange, ...props } = this.props;

    return (
      <span>
        <label>{ label }:</label>
        <Field
          type="number"
          value={ value.toString() }
          className={ className }
          name={ name }
          onChange={ this._onChangeField }
          { ...props }
        />
      </span>
    );
  }

  @Bind
  private _onChangeField (value: string): void {
    const { onChange } = this.props;

    if (onChange) {
      onChange(parseInt(value));
    }
  }
}
