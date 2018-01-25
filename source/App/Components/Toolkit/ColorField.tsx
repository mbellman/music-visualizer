import '@styles/Stateless/ColorField.less';

import { h, Component } from 'preact';
import { Bind, Callback, Override, Utils } from '@core';

interface IColorFieldProps {
  value?: string;
  onChange?: Callback<string>;
}

export default class ColorField extends Component<IColorFieldProps, any> {
  @Override
  public render (): JSX.Element {
    return (
      <div class="color-field">
        <label>#</label>
        <input
          type="text"
          onKeyUp={ this._onKeyUpInput }
          size={ 2 }
          maxLength={ 6 }
          value={ this.props.value }
        />
      </div>
    );
  }

  @Bind
  private _onKeyUpInput (e: UIEvent): void {
    const { value } = e.target as HTMLInputElement;
    const { onChange } = this.props;

    if (onChange) {
      onChange(value);
    }
  }
}
