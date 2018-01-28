import { h, Component } from 'preact';
import { Bind, Callback, Implementation, Override } from '@base';

export interface ISelectableProps {
  className?: string;
  name?: string;
  onChange?: Callback<Selectable>;
  selected?: boolean;
  selectableRef?: Callback<Selectable>;
}

export interface ISelectableState {
  isSelected: boolean;
}

/**
 * A component which can be toggled between selected and unselected states on
 * mouse click. The intended usage is composition by a wrapper component, ex:
 *
 *  class SelectableWrapper extends Component<ISelectableWrapperProps, any> {
 *    public render (): JSX.Element {
 *      return (
 *        <Selectable className='custom-class' { ...this.props }>
 *          ...
 *        </Selectable>
 *      );
 *    }
 *  }
 *
 * This eliminates the need to extend Selectable, but requires that { ...props }
 * are funneled into the composed Selectable so Selectable props can be used on
 * wrapper components too.
 */
export default class Selectable extends Component<ISelectableProps, ISelectableState> {
  public state: ISelectableState = {
    isSelected: !!this.props.selected
  };

  public get selected (): boolean {
    return this.state.isSelected;
  }

  public set selected (newSelectedState: boolean) {
    const { isSelected } = this.state;
    const { onChange } = this.props;

    if (isSelected === newSelectedState) {
      return;
    }

    this.setState({
      isSelected: newSelectedState
    });

    if (onChange) {
      onChange(this);
    }
  }

  /**
   * Here a 'selectableRef' function funneled through a wrapper component from
   * a grandparent or higher-level component can get called to yield a reference
   * to the Selectable instance.
   */
  @Implementation
  public componentWillMount (): void {
    const { selected, selectableRef } = this.props;

    if (selectableRef) {
      selectableRef(this);
    }
  }

  @Implementation
  public componentWillReceiveProps ({ selected }: ISelectableProps): void {
    this.selected = selected;
  }

  @Override
  public render (): JSX.Element {
    const { className, children } = this.props;
    const { isSelected } = this.state;

    return (
      <div
        className={ `${className} ${isSelected ? ' selected' : ''}` }
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
