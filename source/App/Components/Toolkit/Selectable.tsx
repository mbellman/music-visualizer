import { h, Component } from 'preact';
import { Bind, Callback, Implementation, Override } from '@base';

export interface ISelectableProps {
  className?: string;
  name?: string;
  onSelect?: Callback<Selectable>;
  onUnselect?: Callback<Selectable>;
  selected?: boolean;
  selectableRef?: Callback<Selectable>;
}

export interface ISelectableState {
  isSelected: boolean;
}

export default class Selectable extends Component<ISelectableProps, ISelectableState> {
  public state: ISelectableState = {
    isSelected: !!this.props.selected
  };

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

  @Implementation
  public componentWillMount (): void {
    const { selectableRef } = this.props;

    if (selectableRef) {
      selectableRef(this);
    }
  }

  @Override
  public render (): JSX.Element {
    const { className, children } = this.props;
    const { isSelected } = this.state;

    return (
      <div
        class={ `${className} ${isSelected ? ' selected' : ''}` }
        onClick={ this.onClick }
      >
        { this.props.children }
      </div>
    );
  }

  @Bind
  protected onClick (e: UIEvent): void {
    this.selected = !this.state.isSelected;
  }
}
