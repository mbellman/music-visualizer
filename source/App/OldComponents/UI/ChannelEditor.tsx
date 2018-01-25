import 'App/Styles/ChannelEditor.less';
import Canvas, { DrawSetting } from 'Graphics/Canvas';
import Channel from 'AppCore/MIDI/Channel';
import FillEditor from 'App/Components/UI/FillEditor';
import ShapeEditor from 'App/Components/UI/ShapeEditor';
import StrokeEditor from 'App/Components/UI/StrokeEditor';
import { h, Component } from 'preact';
import { IChannelCustomizer } from 'App/State/Types';
import { Bind, Implementation, Override } from 'Base/Core';
import { Effects, IFillTemplate, IStrokeTemplate, IEffectTemplate, IShapeTemplate, Shapes } from 'App/State/VisualizationTypes';

interface IChannelEditorProps {
  channel: Channel;
  channelCustomizer: IChannelCustomizer;
}

interface IChannelEditorState extends IChannelCustomizer {}

export default class ChannelEditor extends Component<IChannelEditorProps, IChannelEditorState> {
  public static readonly EFFECT_RENDERING_ORDER: Effects[] = [
    Effects.FILL,
    Effects.STROKE,
    Effects.GLOW
  ];

  public state: IChannelEditorState = {
    shapeCustomizer: {
      shapeTemplate: {
        type: Shapes.BAR,
        size: 20
      },
      effectTemplates: [
        {
          type: Effects.FILL,
          color: '00f',
          isDelayed: false
        }
      ]
    }
  };

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
            <ShapeEditor onChange={ this._onChangeShape } />
          </div>

          <FillEditor onChange={ this._onChangeEffect } selected />
          <StrokeEditor onChange={ this._onChangeEffect } />
        </div>
      </div>
    );
  }

  @Bind
  private _onChangeShape (shapeTemplate: IShapeTemplate): void {
    this.setState({
      ...this.state,
      shapeCustomizer: {
        shapeTemplate,
        effectTemplates: []
      }
    });
  }

  @Bind
  private _onChangeEffect (effectTemplate: IEffectTemplate): void {
    console.log(effectTemplate);
  }

  private _renderNotePreview (): void {
    const { shapeTemplate, effectTemplates } = this.state.shapeCustomizer;

    this._previewCanvas.clear().set(DrawSetting.FILL_COLOR, '#00f');

    switch (shapeTemplate.type) {
      case Shapes.BAR:
        this._previewCanvas.rectangle(10, 10, 40, shapeTemplate.size).fill();
        break;
      case Shapes.BALL:
        this._previewCanvas.circle(50, 50, shapeTemplate.size).fill();
        break;
    }
  }
}
