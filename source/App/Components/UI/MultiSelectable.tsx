import Selectable from 'App/Components/UI/Selectable';
import { h, cloneElement, Component } from 'preact';
import { Bind, Callback, IConstructor, Override, Utils } from 'Base/Core';

interface IMultiSelectableProps {
  max?: number;
  onChange?: Callback<any>;
}

export default class MultiSelectable extends Component<IMultiSelectableProps, any> {
  private _selectables: Selectable<any>[] = [];

  public get totalSelected (): number {
    return this._selectables.filter((selectable: Selectable<any>) => {
      return selectable.selected;
    }).length;
  }

  @Override
  public render (): JSX.Element {
    this._selectables.length = 0;

    return (
      <span>
        {
          this.props.children.map((child: JSX.Element) => {
            return cloneElement(child, {
              ref: this._addSelectable,
              onSelect: this._onToggleSelectable,
              onUnselect: this._onToggleSelectable
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
    const { props, totalSelected } = this;
    const { max, onChange } = props;
    const isChangeAllowed: boolean = totalSelected > 0 && totalSelected <= (max || 1);

    if (isChangeAllowed) {
      if (onChange) {
        onChange();
      }
    } else {
      if (!max && totalSelected > 1) {
        this._silentlyDeselectAll();
      }

      selectable.selected = !selectable.selected;
    }
  }
}
