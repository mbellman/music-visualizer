import 'App/Styles/UI/Checkbox.less';
import Selectable, { ISelectableProps } from 'App/Components/UI/Selectable';
import { h, Component } from 'preact';
import { Callback, Utils } from 'Base/Core';

interface ICheckboxProps extends ISelectableProps {}

export default class Checkbox extends Selectable<ICheckboxProps> {
  public render (): JSX.Element {
    return (
      <div
        class={ `checkbox ${this.state.isSelected ? 'selected' : ''}` }
        onClick={ this.onClick }
      />
    );
  }
}
