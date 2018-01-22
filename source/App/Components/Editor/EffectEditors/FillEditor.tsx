import ColorField from 'App/Components/UI/ColorField';
import EffectEditor, { IEffectEditorProps } from 'App/Components/Editor/EffectEditors/EffectEditor';
import { IFill } from 'App/State/VisualizationTypes';
import { h, Component } from 'preact';
import { Bind, Implementation } from 'Base/Core';

export default class FillEditor extends EffectEditor<IFill> {
  public static readonly DEFAULT_COLOR: string = '00f';

  public state: IFill = {
    color: FillEditor.DEFAULT_COLOR,
    isDelayed: false,
    isSelected: this.props.selected
  };

  @Implementation
  protected renderContents (): JSX.Element {
    const { color, isSelected } = this.state;

    return (
      <span>
        <label>Fill:</label>
        <ColorField value={ color } onChange={ this._onChangeColor } />
      </span>
    );
  }

  @Bind
  private _onChangeColor (color: string): void {
    this.dispatchChange({ color });
  }
}
