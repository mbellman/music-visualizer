import { h, Component } from 'preact';
import { Bind, Callback, Override } from '@base';

export interface IFieldProps {
  onChange?: Callback<string>;
  [prop: string]: any;
}

export default class Field extends Component<IFieldProps, any> {
  @Override
  public render (): JSX.Element {
    const { onChange, ref, ...props } = this.props;

    return <input onKeyUp={ this._onKeyUp } { ...props } />;
  }

  @Bind
  private _onKeyUp (e: KeyboardEvent): void {
    const { value } = e.target as HTMLInputElement;
    const { onChange } = this.props;

    if (onChange) {
      onChange(value);
    }
  }
}
