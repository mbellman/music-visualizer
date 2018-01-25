import 'App/Styles/UI/SelectableButton.less';
import Selectable, { ISelectableProps } from 'App/Components/Extensible/Selectable';
import { Callback, Override } from 'Base/Core';
import { h } from 'preact';

interface ISelectableButtonProps extends ISelectableProps {
  value: string;
}

export default class SelectableButton extends Selectable<ISelectableButtonProps> {
  @Override
  public render (): JSX.Element {
    return (
      <div
        class={ `selectable-button ${this.state.isSelected ? 'selected' : ''}` }
        name={ this.props.name }
        onClick={ this.onClick }
      >
        { this.props.value }
      </div>
    );
  }
}
