import { Bind, Callback, Override } from '@base';
import { Component, h } from 'preact';

export interface IFieldProps {
  onChange?: Callback<string>;
  [prop: string]: any;
}

export default class Field extends Component<IFieldProps, any> {
  @Override
  public render (): JSX.Element {
    const { onChange, ref, ...props } = this.props;

    return <input onInput={ this._onInput } { ...props } />;
  }

  @Bind
  private _onInput (e: KeyboardEvent): void {
    const { value } = e.target as HTMLInputElement;
    const { onChange } = this.props;

    if (onChange) {
      onChange(value);
    }
  }
}
