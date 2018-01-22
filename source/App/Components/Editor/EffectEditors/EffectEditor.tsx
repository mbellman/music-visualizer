import SelectableButton from 'App/Components/UI/SelectableButton';
import SelectableBox from 'App/Components/UI/SelectableBox';
import { ISelectableProps } from 'App/Components/UI/Selectable';
import { IEffect } from 'App/State/VisualizationTypes';
import { h, Component } from 'preact';
import { Bind, Callback, Override } from 'Base/Core';

export interface IEffectEditorProps<T extends IEffect = IEffect> {
  onChange?: Callback<T>;
  onDelay?: Callback<any>;
  onSelect?: Callback<any>;
  onUndelay?: Callback<any>;
  onUnselect?: Callback<any>;
  selected?: boolean;
}

export default abstract class EffectEditor<T extends IEffect = IEffect> extends Component<IEffectEditorProps<T>, T> {
  @Override
  public render (): JSX.Element {
    return (
      <div class="effect-editor">
        <SelectableBox
          onSelect={ this._onSelect }
          onUnselect={ this._onUnselect }
          selected={ this.props.selected }
        />

        { this.renderContents() }

        <SelectableButton
          value="Delay"
          onSelect={ this._onDelay }
          onUnselect={ this._onUndelay }
        />
      </div>
    );
  }

  protected dispatchChange <K extends keyof T>(state: Pick<T, K>): void {
    const { onChange } = this.props;

    this.setState(state);

    if (onChange) {
      onChange(this.state);
    }
  }

  @Bind
  private _onDelay (): void {
    this.dispatchChange({ isDelayed: true });
  }

  @Bind
  private _onUndelay (): void {
    this.dispatchChange({ isDelayed: false });
  }

  @Bind
  private _onSelect (): void {
    this.dispatchChange({ isSelected: true });
  }

  @Bind
  private _onUnselect (): void {
    this.dispatchChange({ isSelected: false });
  }

  protected abstract renderContents (): JSX.Element;
}
