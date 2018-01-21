import 'App/Styles/ChannelEditor.less';
import Canvas from 'Graphics/Canvas';
import Channel from 'AppCore/MIDI/Channel';
import Checkbox from 'App/Components/UI/Checkbox';
import ColorField from 'App/Components/UI/ColorField';
import SelectableButton from 'App/Components/UI/SelectableButton';
import { h, Component } from 'preact';
import { IChannelCustomizer } from 'App/State/Types';

interface IChannelEditorProps {
  channel: Channel;
  channelCustomizer: IChannelCustomizer;
}

export default class ChannelEditor extends Component<IChannelEditorProps, any> {
  private _previewCanvas: Canvas;

  public componentDidMount (): void {
    this._previewCanvas = new Canvas(this.base.querySelector('canvas'));

    this._renderNotePreview();
  }

  public componentDidUpdate (): void {
    this._renderNotePreview();
  }

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
            <SelectableButton value="Bar" selected />
            <SelectableButton value="Ball" />
          </div>

          <div>
            <Checkbox
              onSelect={ this._onCheckFill }
              onUnselect={ this._onUncheckFill }
              selected
            />
            <label>Fill:</label>
            <ColorField value="00f" />
          </div>
        </div>
      </div>
    );
  }

  private _onCheckFill (): void {
    console.log('Fill!');
  }

  private _onUncheckFill (): void {
    console.log('No fill!');
  }

  private _renderNotePreview (): void {

  }
}
