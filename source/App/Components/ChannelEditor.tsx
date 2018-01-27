import '@styles/ChannelEditor.less';

import Canvas, { DrawSetting } from 'Graphics/Canvas';
import Channel from '@core/MIDI/Channel';
import FillEditor from '@components/FillEditor';
// import StrokeEditor from '@components/StrokeEditor';
import { h, Component } from 'preact';
import { IAppState } from '@state/Types';
import { Bind, Extension, Implementation, Override } from '@base';
import { IFillTemplate, IStrokeTemplate, IEffectTemplate, IShapeTemplate, ShapeTypes } from '@state/VisualizationTypes';
import Sequence from '@core/MIDI/Sequence';
import { Connect } from '@components/Toolkit/Decorators';
import ShapeEditor from '@components/ShapeEditor';
import { Selectors } from '@state/Selectors';

interface IChannelEditorPropsFromState {
  channel?: Channel;
  shapeTemplate?: IShapeTemplate;
  effectTemplates?: Extension<IEffectTemplate>[];
}

interface IChannelEditorProps extends IChannelEditorPropsFromState {
  index: number;
}

function mapStateToProps (state: IAppState, { index }: IChannelEditorProps): IChannelEditorPropsFromState {
  const { sequence } = state.selectedPlaylistTrack;

  return {
    channel: sequence.getChannel(index),
    shapeTemplate: Selectors.getShapeTemplate(state, index),
    effectTemplates: Selectors.getEffectTemplates(state, index)
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

  private _renderNoteEffects (): void {
    const { color } = this.props.effectTemplates[0] as IFillTemplate;

    this._previewCanvas.set(DrawSetting.FILL_COLOR, `#${color}`).fill();
  }

  private _renderNotePreview (): void {
    this._previewCanvas.clear();
    this._renderNoteShape();
    this._renderNoteEffects();
  }

  private _renderNoteShape (): void {
    const { shapeType, size } = this.props.shapeTemplate;

    switch (shapeType) {
      case ShapeTypes.BAR:
        this._previewCanvas.rectangle(10, 18, 60, size);
        break;
      case ShapeTypes.BALL:
        this._previewCanvas.circle(40, 30, size);
        break;
    }
  }
}
