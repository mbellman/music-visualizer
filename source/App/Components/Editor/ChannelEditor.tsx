import 'App/Styles/ChannelEditor.less';
import Canvas from 'Graphics/Canvas';
import Channel from 'AppCore/MIDI/Channel';
import Checkbox from 'App/Components/UI/Checkbox';
import ColorField from 'App/Components/UI/ColorField';
import SelectableButton from 'App/Components/UI/SelectableButton';
import MultiSelectable from 'App/Components/UI/MultiSelectable';
import { h, Component } from 'preact';
import { IChannelCustomizer } from 'App/State/Types';
import { Implementation, Override } from 'Base/Core';

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

          <div>
            <Checkbox
              name="Fill"
              onSelect={ this._onCheckEffect }
              onUnselect={ this._onUncheckEffect }
              selected
            />
            <label>Fill:</label>
            <ColorField value="00f" />
          </div>
        </div>
      </div>
    );
  }

  private _onCheckEffect (checkbox: Checkbox): void {
    console.log(checkbox);
  }

  private _onUncheckEffect (checkbox: Checkbox): void {
    console.log(checkbox);
  }

  private _renderNotePreview (): void {

  }
}
