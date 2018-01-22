import 'App/Styles/ChannelEditor.less';
import Canvas from 'Graphics/Canvas';
import Channel from 'AppCore/MIDI/Channel';
import FillEditor from 'App/Components/Editor/EffectEditors/FillEditor';
import MultiSelectable from 'App/Components/UI/MultiSelectable';
import SelectableButton from 'App/Components/UI/SelectableButton';
import StrokeEditor from 'App/Components/Editor/EffectEditors/StrokeEditor';
import { h, Component } from 'preact';
import { IChannelCustomizer } from 'App/State/Types';
import { Bind, Implementation, Override } from 'Base/Core';
import { IFill, IStroke } from 'App/State/VisualizationTypes';

interface IChannelEditorProps {
  channel: Channel;
  channelCustomizer: IChannelCustomizer;
}

export default class ChannelEditor extends Component<IChannelEditorProps, any> {
  private _previewCanvas: Canvas;

  @Implementation
  public componentDidMount (): void {
    this._previewCanvas = new Canvas(this.base.querySelector('canvas'));

    this._renderNotePreview();
  }

  @Implementation
  public componentDidUpdate (): void {
    this._renderNotePreview();
  }

  @Override
  public render (): JSX.Element {
    const { channel, channelCustomizer } = this.props;

    return (
      <div class="channel-editor" id={ `${channel.id}` }>
        <div class="channel-editor-header">
          <h4 class="channel-title">Channel { channel.id }</h4>
          <label>Total notes:</label> <span>{ channel.size }</span>
        </div>

        <div class="channel-editor-body">
          <canvas class="preview"></canvas>

          <div>
            <label>Shape:</label>
            <MultiSelectable>
              <SelectableButton value="Bar" selected />
              <SelectableButton value="Ball" />
            </MultiSelectable>
          </div>

          <FillEditor onChange={ this._onChangeFill } selected />
          <StrokeEditor onChange={ this._onChangeStroke } />
        </div>
      </div>
    );
  }

  @Bind
  private _onChangeFill (fill: IFill): void {
    console.log(fill);
  }

  @Bind
  private _onChangeStroke (stroke: IStroke): void {
    console.log(stroke);
  }

  private _renderNotePreview (): void {

  }
}
