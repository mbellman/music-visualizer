import SelectableButton from 'App/Components/UI/SelectableButton';
import SelectableBox from 'App/Components/UI/SelectableBox';
import { IEffectTemplate } from 'App/State/VisualizationTypes';
import { h, Component } from 'preact';
import { Bind, Callback, Override } from 'Base/Core';
import ChangeDispatcher, { IChangeDispatcherProps } from 'App/Components/Extensible/ChangeDispatcher';

export interface IEffectEditorProps<T extends IEffectEditorState> extends IChangeDispatcherProps<T> {
  delayed?: boolean;
  selected?: boolean;
}

export interface IEffectEditorState {
  isDelayed: boolean;
  isSelected: boolean;
}

export default abstract class EffectEditor<S extends IEffectEditorState> extends ChangeDispatcher<IEffectEditorProps<S>, S> {
  @Override
  public render (): JSX.Element {
    return (
      <div class={ `effect-editor ${this.state.isSelected ? 'selected' : ''}` }>
        <SelectableBox
          onSelect={ this._onSelect }
          onUnselect={ this._onUnselect }
          selected={ this.state.isSelected }
        />

        { this.renderContents() }

        <SelectableButton
          value="Delay"
          onSelect={ this._onDelay }
          onUnselect={ this._onUndelay }
          selected={ this.state.isDelayed }
        />
      </div>
    );
  }

  protected abstract renderContents (): JSX.Element;

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
}
