import Selectable, { ISelectableProps } from '@components/Toolkit/Selectable';
import { h, cloneElement, Component } from 'preact';
import { Bind, Callback, Override, Utils } from 'Base/Core';

interface IEnhancedSelectableProps extends ISelectableProps {
  index: number;
}

interface IMultiSelectableProps {
  max?: number;
  onChange?: Callback<ISelectedItem[]>;
}

export interface ISelectedItem {
  index: number;
  name: string;
}

export default class MultiSelectable extends Component<IMultiSelectableProps, any> {
  private _selectables: Selectable[] = [];

  public get selected (): ISelectedItem[] {
    return this._selectables
      .filter(({ selected }) => selected)
      .map(({ props }) => {
        const { index, name } = props as IEnhancedSelectableProps;

        return { index, name };
      });
  }

  @Override
  public render (): JSX.Element {
    this._selectables.length = 0;

    return (
      <span>
        {
          this.props.children.map((child: JSX.Element, index: number) => {
            return cloneElement(child, {
              selectableRef: this._addSelectable,
              onSelect: this._onToggleSelectable,
              onUnselect: this._onToggleSelectable,
              index
            });
          })
        }
      </span>
    );
  }

  @Bind
  private _addSelectable (selectable: Selectable): void {
    this._selectables.push(selectable);
  }

  /**
   * "Silently" deselects all child Selectables via setState()
   * rather than the 'selected' setter, which avoids triggering
   * any onUnselect handlers.
   */
  private _silentlyDeselectAll (): void {
    this._selectables.forEach((selectable: Selectable) => {
      selectable.setState({
        isSelected: false
      });
    });
  }

  @Bind
  private _onToggleSelectable (selectable: Selectable): void {
    const { props, selected } = this;
    const { max, onChange } = props;
    const isChangeAllowed: boolean = selected.length > 0 && selected.length <= (max || 1);

    if (isChangeAllowed) {
      if (onChange) {
        onChange(this.selected);
      }
    } else {
      if (!max && selected.length > 1) {
        this._silentlyDeselectAll();
      }

      selectable.selected = !selectable.selected;
    }
  }
}
