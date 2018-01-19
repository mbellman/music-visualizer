import 'App/Styles/ChannelCustomizer.less';
import Canvas from 'Graphics/Canvas';
import Channel from 'AppCore/MIDI/Channel';
import { h, Component } from 'preact';
import { IChannelCustomization } from 'App/State/Types';

interface IChannelCustomizerProps {
  channel: Channel;
  // channelCustomization: IChannelCustomization;
}

export default class ChannelCustomizer extends Component<IChannelCustomizerProps, any> {
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
      <div class="channel" id={ 'channel-' + this.props.channel.id }>
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
