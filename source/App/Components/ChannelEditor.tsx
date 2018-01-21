import 'App/Styles/ChannelEditor.less';
import Canvas from 'Graphics/Canvas';
import Channel from 'AppCore/MIDI/Channel';
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
    const { channel } = this.props;

    return (
      <div class="channel-editor" id={ `${channel.id}` }>
        <canvas class="preview"></canvas>

        <div>
          <h4 class="channel-title">Channel { channel.id }</h4>
          <label>Total notes:</label> <span>{ channel.size }</span>
        </div>

        <label>Shape:</label>
        <select id="${channel.id}">
          <option value="Bar">Bar</option>
          <option value="Ball">Ball</option>
        </select>

        <label>Effects:</label>
      </div>
    );
  }

  private _renderNotePreview (): void {

  }
}
