import ColorField from 'App/Components/UI/ColorField';
import EffectEditor, { IEffectEditorProps, IEffectEditorState } from 'App/Components/Extensible/EffectEditor';
import { Effects, IFillTemplate } from 'App/State/VisualizationTypes';
import { h, Component } from 'preact';
import { Bind, Implementation } from 'Base/Core';

interface IFillEditorState extends IEffectEditorState, IFillTemplate {}

export default class FillEditor extends EffectEditor<IFillEditorState> {
  public static readonly DEFAULT_COLOR: string = '00f';

  public state: IFillEditorState = {
    type: Effects.FILL,
    color: FillEditor.DEFAULT_COLOR,
    isDelayed: this.props.delayed,
    isSelected: this.props.selected
  };

  @Implementation
  protected renderContents (): JSX.Element {
    const { color } = this.state;

    return (
      <Changeable>
        <label>Fill:</label>
        <ColorField value={ color } onChange={ this._onChangeColor } />
      </Changeable>
    );
  }

  @Bind
  private _onChangeColor (color: string): void {
    this.dispatchChange({ color });
  }
}
