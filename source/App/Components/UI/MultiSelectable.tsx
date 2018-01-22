import Selectable from 'App/Components/UI/Selectable';
import { h, cloneElement, Component } from 'preact';
import { Callback, IConstructor, Override, Utils } from 'Base/Core';

interface IMultiSelectableProps {
  max?: number;
  onChange?: Callback<any>;
}

export default class MultiSelectable extends Component<IMultiSelectableProps, any> {
  private _selectables: Selectable<any>[] = [];

  public constructor (props: any) {
    super();

    Utils.bindAll(this, '_addSelectable', '_isPreselected', '_onClickSelectable');
  }

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
              onSelect: this._onClickSelectable,
              onUnselect: this._onClickSelectable
            });
          })
        }
      </span>
    );
  }

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

  private _onClickSelectable (selectable: Selectable<any>): void {
    const { props, totalSelected } = this;
    const { max, onChange } = props;
    const isChangeAllowed: boolean = totalSelected > 0 && totalSelected <= (max || 1);

    if (isChangeAllowed) {
      onChange();
    } else {
      if (!max && totalSelected > 1) {
        this._silentlyDeselectAll();
      }

      selectable.selected = !selectable.selected;
    }
  }
}
