import ColorField from 'App/Components/UI/ColorField';
import EffectEditor, { IEffectEditorProps } from 'App/Components/Editor/EffectEditors/EffectEditor';
import { IStroke } from 'App/State/VisualizationTypes';
import { h, Component } from 'preact';
import { Bind, Implementation } from 'Base/Core';

export default class StrokeEditor extends EffectEditor<IStroke> {
  public static readonly DEFAULT_COLOR: string = '00f';
  public static readonly DEFAULT_WIDTH: number = 2;

  public state: IStroke = {
    color: StrokeEditor.DEFAULT_COLOR,
    isDelayed: false,
    isSelected: this.props.selected,
    width: StrokeEditor.DEFAULT_WIDTH
  };

  @Implementation
  protected renderContents (): JSX.Element {
    const { color, isSelected, width } = this.state;

    return (
      <span>
        <label>Stroke:</label>
        <ColorField
          value={ color }
          onChange={ this._onChangeColor }
        />

        <label>Width:</label>
        <input
          type="text"
          size={ 1 }
          value={ `${width}` }
          onKeyUp={ this._onKeyUpWidthInput }
        />
      </span>
    );
  }

  @Bind
  private _onChangeColor (color: string): void {
    this.dispatchChange({ color });
  }

  @Bind
  private _onKeyUpWidthInput (e: KeyboardEvent): void {
    const { value } = e.target as HTMLInputElement;

    if (value) {
      this.dispatchChange({
        width: parseInt(value)
      });
    }
  }
}
