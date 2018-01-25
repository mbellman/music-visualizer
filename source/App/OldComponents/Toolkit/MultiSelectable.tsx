import Selectable from 'App/Components/Toolkit/Selectable';
import { h, cloneElement, Component } from 'preact';
import { Bind, Callback, Override, Utils } from 'Base/Core';
import Changeable from 'App/Components/Toolkit/Changeable';

interface IMultiSelectableProps {
  max?: number;
  onChange?: Callback<ISelectedItem[]>;
}

export interface ISelectedItem {
  index: number;
  name: string;
}

class MultiSelectable extends Component<IMultiSelectableProps, any> {
  private _selectables: Selectable<any>[] = [];

  public get selected (): ISelectedItem[] {
    return this._selectables
      .filter((selectable: Selectable<any>) => selectable.selected)
      .map((selectable: Selectable<any>) => {
        const { index, name } = selectable.props;

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
              ref: this._addSelectable,
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
  private _addSelectable (selectable: Selectable<any>): void {
    this._selectables.push(selectable);
  }

  /**
   * "Silently" deselects all child Selectables via setState()
   * rather than the 'selected' setter, which avoids triggering
   * any onUnselect handlers.
   */
  private _silentlyDeselectAll (): void {
    this._selectables.forEach((selectable: Selectable<any>) => {
      selectable.setState({
        isSelected: false
      });
    });
  }

  @Bind
  private _onToggleSelectable (selectable: Selectable<any>): void {
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
