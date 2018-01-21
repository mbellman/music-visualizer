import 'App/Styles/UI/Checkbox.less';
import { h, Component } from 'preact';
import { Callback, Utils } from 'Base/Core';

interface ISelectableState {
  isSelected: boolean;
}

export interface ISelectableProps {
  selected?: boolean;
  onSelect?: Callback<any>;
  onUnselect?: Callback<any>;
}

export default abstract class Selectable<T extends ISelectableProps> extends Component<T, ISelectableState> {
  public state: ISelectableState = {
    isSelected: false
  };

  public constructor (props: T) {
    super();

    Utils.bindAll(this, 'onClick');

    this.setState({
      isSelected: !!props.selected
    });
  }

  protected onClick (e: UIEvent): void {
    this.setState({
      isSelected: !this.state.isSelected
    });

    if (this.state.isSelected && !!this.props.onSelect) {
      this.props.onSelect();
    } else if (!this.state.isSelected && !!this.props.onUnselect) {
      this.props.onUnselect();
    }
  }
}
