import 'App/Styles/ChannelOptions.less';
import Canvas from 'Graphics/Canvas';
import Channel from 'AppCore/MIDI/Channel';
import { h, Component } from 'preact';

interface IChannelOptionsProps {
  channel: Channel;
}

export default class ChannelOptions extends Component<IChannelOptionsProps, any> {
  private _previewCanvas: Canvas;

  public componentDidMount (): void {
    this._previewCanvas = new Canvas(this.base.querySelector('canvas'));

    this._renderNotePreview();
  }

  public componentDidUpdate (): void {
    this._renderNotePreview();
  }

  public render (): JSX.Element {
    return (
      <div class="channel" id={ `channel-${this.props.channel.id}` }>
        <canvas class="preview"></canvas>

        <div>
          <h4 class="title">Channel { this.props.channel.id }</h4>
          <label>Total notes:</label> <span>{ this.props.channel.size }</span>
        </div>

        <label>Shape:</label>
        <select class="shape-selector" id="${channel.id}">
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
