import { h, Component } from 'preact';
import { Bind, Callback, Utils } from 'Base/Core';

export interface ISelectableProps {
  name?: string;
  onSelect?: Callback<any>;
  onUnselect?: Callback<any>;
  selected?: boolean;
}

export interface ISelectableState {
  isSelected: boolean;
}

export default abstract class Selectable<P extends ISelectableProps> extends Component<P, ISelectableState> {
  public state: ISelectableState = {
    isSelected: false
  };

  public constructor (props: P) {
    super();

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

  @Bind
  protected onClick (e: UIEvent): void {
    this.selected = !this.state.isSelected;
  }
}
