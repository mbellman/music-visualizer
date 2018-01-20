import 'App/Styles/ChannelCustomization.less';
import Canvas from 'Graphics/Canvas';
import Channel from 'AppCore/MIDI/Channel';
import { h, Component } from 'preact';
import { IChannelCustomizer } from 'App/State/Types';

interface IChannelCustomizationProps {
  channel: Channel;
  channelCustomizer: IChannelCustomizer;
}

export default class ChannelSettings extends Component<IChannelCustomizationProps, any> {
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
      <div class="channel" id={ 'channel-' + channel.id }>
        <canvas class="preview"></canvas>

        <div>
          <h4 class="title">Channel { channel.id }</h4>
          <label>Total notes:</label> <span>{ channel.size }</span>
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
