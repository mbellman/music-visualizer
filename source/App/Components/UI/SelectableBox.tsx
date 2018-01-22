import 'App/Styles/UI/SelectableBox.less';
import Selectable, { ISelectableProps } from 'App/Components/UI/Selectable';
import { h, Component } from 'preact';
import { Callback, Implementation, Override, Utils } from 'Base/Core';

interface ISelectableBoxProps extends ISelectableProps {
  name?: string;
}

export default class SelectableBox extends Selectable<ISelectableBoxProps> {
  @Override
  public render (): JSX.Element {
    return (
      <div
        class={ `selectable-box ${this.state.isSelected ? 'selected' : ''}` }
        name={ this.props.name }
        onClick={ this.onClick }
      />
    );
  }
}
