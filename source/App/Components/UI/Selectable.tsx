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

  public get selected (): boolean {
    return this.state.isSelected;
  }

  public set selected (isSelected: boolean) {
    const { onSelect, onUnselect } = this.props;

    this.setState({ isSelected });

    if (isSelected && onSelect) {
      onSelect(this);
    } else if (!isSelected && onUnselect) {
      onUnselect(this);
    }
  }

  protected onClick (e: UIEvent): void {
    this.selected = !this.state.isSelected;
  }
}
