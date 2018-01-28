import Selectable, { ISelectableProps } from '@components/Toolkit/Selectable';
import { Bind, Callback, Override, Utils } from 'Base/Core';
import { cloneElement, Component, h } from 'preact';

interface IEnhancedSelectableProps extends ISelectableProps {
  index: number;
}

export interface ISelectedItem {
  index: number;
  name: string;
}

export interface IMultiSelectableProps {
  max?: number;
  onChange?: Callback<ISelectedItem[]>;
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
    return (
      <span>
        {
          this.props.children.map((child: JSX.Element, index: number) => {
            return cloneElement(child, {
              selectableRef: this._addSelectable,
              onChange: this._onChangeSelectable,
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

  @Bind
  private _onChangeSelectable (selectable: Selectable): void {
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
}
