import 'App/Styles/UI/SelectableButton.less';
import Selectable, { ISelectableProps } from 'App/Components/UI/Selectable';
import { Callback } from 'Base/Core';
import { h } from 'preact';

interface ISelectableButtonProps extends ISelectableProps {
  value: string;
}

export default class SelectableButton extends Selectable<ISelectableButtonProps> {
  public render (): JSX.Element {
    return (
      <div
        class={ `selectable-button ${this.state.isSelected ? 'selected' : ''}` }
        onClick={ this.onClick }
      >
        { this.props.value }
      </div>
    );
  }
}
