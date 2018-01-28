import Canvas, { DrawSetting } from 'Graphics/Canvas';
import { Component, h } from 'preact';
import { Connect } from '@components/Toolkit/Decorators';
import { EffectTypes, IEffectTemplate, IFillTemplate, IGlowTemplate, IShapeTemplate, IStrokeTemplate, ShapeTypes } from '@core/Visualization/Types';
import { Extension, Implementation, Override } from '@base';
import { IAppState } from '@state/Types';
import { Selectors } from '@state/Selectors';
import '@styles/NotePreview.less';

interface INotePreviewPropsFromState {
  shapeTemplate?: IShapeTemplate;
  effectTemplates?: Extension<IEffectTemplate>[];
}

interface INotePreviewProps extends INotePreviewPropsFromState {
  channelIndex: number;
}

function mapStateToProps (state: IAppState, { channelIndex }: INotePreviewProps): INotePreviewPropsFromState {
  return {
    shapeTemplate: Selectors.getShapeTemplate(state, channelIndex),
    effectTemplates: Selectors.getEffectTemplates(state, channelIndex)
  };
}

@Connect (mapStateToProps)
export default class NotePreview extends Component<INotePreviewProps, any> {
  private _previewCanvas: Canvas;

  @Implementation
  public componentDidMount (): void {
    this._previewCanvas = new Canvas(this.base as HTMLCanvasElement);

    this._previewCanvas.setSize(80, 50);
    this._renderNotePreview();
  }

  @Implementation
  public componentDidUpdate (): void {
    this._renderNotePreview();
  }

  @Override
  public render (): JSX.Element {
    return <canvas className="note-preview"></canvas>;
  }

  private _renderNoteEffects (): void {
    const { effectTemplates } = this.props;

    effectTemplates.forEach((effectTemplate: Extension<IEffectTemplate>) => {
      const { effectType } = effectTemplate;

      switch (effectType) {
        case EffectTypes.GLOW: {
          const { color, blur, isSelected } = effectTemplate as IGlowTemplate;

          if (isSelected) {
            this._previewCanvas
              .set(DrawSetting.GLOW_COLOR, `#${color}`)
              .set(DrawSetting.GLOW_BLUR, blur);
          }
          break;
        }
        case EffectTypes.FILL: {
          const { color, isSelected } = effectTemplate as IFillTemplate;

          if (isSelected) {
            this._previewCanvas
              .set(DrawSetting.FILL_COLOR, `#${color}`)
              .fill();
          }
          break;
        }
        case EffectTypes.STROKE: {
          const { color, width, isSelected } = effectTemplate as IStrokeTemplate;

          if (isSelected) {
            this._previewCanvas
              .set(DrawSetting.STROKE_COLOR, `#${color}`)
              .set(DrawSetting.STROKE_WIDTH, width)
              .stroke();
          }
          break;
        }
      }
    });
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
