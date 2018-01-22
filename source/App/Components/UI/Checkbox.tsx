import 'App/Styles/UI/Checkbox.less';
import Selectable, { ISelectableProps } from 'App/Components/UI/Selectable';
import { h, Component } from 'preact';
import { Callback, Implementation, Override, Utils } from 'Base/Core';

interface ICheckboxProps extends ISelectableProps {
  name?: string;
}

export default class Checkbox extends Selectable<ICheckboxProps> {
  @Override
  public render (): JSX.Element {
    return (
      <div
        class={ `checkbox ${this.state.isSelected ? 'selected' : ''}` }
        name={ this.props.name }
        onClick={ this.onClick }
      />
    );
  }
}
