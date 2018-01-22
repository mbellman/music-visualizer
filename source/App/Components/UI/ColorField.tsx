import 'App/Styles/UI/ColorField.less';
import { h, Component } from 'preact';
import { Callback, Override } from 'Base/Core';

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
        <input type="text" maxLength={ 6 } value={ this.props.value } />
      </div>
    );
  }

  private _onKeyUp (e: UIEvent): void {
    const target: HTMLInputElement = e.target as HTMLInputElement;

    if (this.props.onChange) {
      this.props.onChange(target.value);
    }
  }
}
