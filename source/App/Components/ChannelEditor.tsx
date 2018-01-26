import '@styles/ChannelEditor.less';

import Canvas, { DrawSetting } from 'Graphics/Canvas';
import Channel from '@core/MIDI/Channel';
import FillEditor from '@components/FillEditor';
// import StrokeEditor from '@components/StrokeEditor';
import { h, Component } from 'preact';
import { IAppState } from '@state/Types';
import { Bind, Implementation, Override } from '@base';
import { Effects, IFillTemplate, IStrokeTemplate, IEffectTemplate, IShapeTemplate, Shapes } from '@state/VisualizationTypes';
import Sequence from '@core/MIDI/Sequence';
import { Connect } from '@components/Toolkit/Decorators';
import ShapeEditor from '@components/ShapeEditor';
import { Selectors } from '@state/Selectors';

interface IChannelEditorPropsFromState {
  channel?: Channel;
  shape?: Shapes;
}

interface IChannelEditorProps extends IChannelEditorPropsFromState {
  index: number;
}

function mapStateToProps (state: IAppState, { index }: IChannelEditorProps): IChannelEditorPropsFromState {
  const { sequence, customizer } = state.selectedPlaylistTrack;

  return {
    channel: sequence.getChannel(index),
    shape: Selectors.getShapeTemplate(state, index).type
  };
}

@Connect(mapStateToProps)
export default class ChannelEditor extends Component<IChannelEditorProps, any> {
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

          <FillEditor channelIndex={ index } />
        </div>
      </div>
    );
  }

  private _renderNotePreview (): void {
    console.log(this.props.shape);
  }
}
