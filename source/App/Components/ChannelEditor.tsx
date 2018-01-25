import '@styles/ChannelEditor.less';

import Canvas, { DrawSetting } from 'Graphics/Canvas';
import Channel from '@core/MIDI/Channel';
/*
import FillEditor from '@components/FillEditor';
import StrokeEditor from '@components/StrokeEditor';
*/
import { h, Component } from 'preact';
import { IChannelCustomizer, IAppState } from '@state/Types';
import { Bind, Implementation, Override } from '@base';
import { Effects, IFillTemplate, IStrokeTemplate, IEffectTemplate, IShapeTemplate, Shapes } from '@state/VisualizationTypes';
import Sequence from '@core/MIDI/Sequence';
import { Connect } from '@components/Decorators';
import ShapeEditor from '@components/ShapeEditor';

interface IChannelEditorProps {
  index: number;
  channel?: Channel;
  customizer?: IChannelCustomizer;
}

interface IChannelEditorState extends IChannelCustomizer {}

function mapStateToProps (state: IAppState, props: IChannelEditorProps): Partial<IChannelEditorProps> {
  const { sequence } = state.selectedPlaylistTrack;

  return {
    channel: sequence.getChannel(props.index)
  };
}

@Connect(mapStateToProps)
export default class ChannelEditor extends Component<IChannelEditorProps, IChannelEditorState> {
  private _previewCanvas: Canvas;

  @Implementation
  public componentDidMount (): void {
    this._previewCanvas = new Canvas(this.base.querySelector('canvas'));

    this._previewCanvas.setSize(80, 50);
    this._renderNotePreview();
  }

  @Implementation
  public componentDidUpdate (): void {
    this._renderNotePreview();
  }

  @Override
  public render (): JSX.Element {
    const { channel, index } = this.props;

    return (
      <div class="channel-editor" id={ `${channel.id}` }>
        <div class="channel-editor-header">
          <h4 class="channel-title">Channel { channel.id }</h4>
          <label>Total notes:</label> <span>{ channel.size }</span>
        </div>

        <div class="channel-editor-body">
          <canvas class="preview"></canvas>

          <div>
            <ShapeEditor channelIndex={ index } />
          </div>
        </div>
      </div>
    );
  }

  @Bind
  private _onChangeShape (shapeTemplate: IShapeTemplate): void {
    console.log(shapeTemplate);
  }

  @Bind
  private _onChangeEffect (effectTemplate: IEffectTemplate): void {
    console.log(effectTemplate);
  }

  private _renderNotePreview (): void {

  }
}
