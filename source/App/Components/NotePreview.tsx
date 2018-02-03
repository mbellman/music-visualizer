import Ball from '@core/Visualization/Shapes/Ball';
import Bar from '@core/Visualization/Shapes/Bar';
import Canvas, { DrawSetting } from '@core/Graphics/Canvas';
import Diamond from '@core/Visualization/Shapes/Diamond';
import Effect from '@core/Visualization/Effects/Effect';
import Ellipse from '@core/Visualization/Shapes/Ellipse';
import Fill from '@core/Visualization/Effects/Fill';
import Glow from '@core/Visualization/Effects/Glow';
import Shape from '@core/Visualization/Shapes/Shape';
import Stroke from '@core/Visualization/Effects/Stroke';
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

  private _getEffects (): Effect[] {
    const { effectTemplates } = this.props;

    return effectTemplates
      .filter(({ isSelected }: IEffectTemplate) => isSelected)
      .map((effectTemplate: IEffectTemplate) => {
        const { effectType } = effectTemplate;

        switch (effectType) {
          case EffectTypes.GLOW: {
            const { color, blur } = effectTemplate as IGlowTemplate;

            return new Glow().construct('#' + color, blur);
          }
          case EffectTypes.FILL: {
            const { color } = effectTemplate as IFillTemplate;

            return new Fill().construct('#' + color);
          }
          case EffectTypes.STROKE: {
            const { color, width } = effectTemplate as IStrokeTemplate;

            return new Stroke().construct('#' + color, width);
          }
        }
      });
  }

  private _getShape (): Shape {
    const { shapeType, size } = this.props.shapeTemplate;

    switch (shapeType) {
      case ShapeTypes.BALL:
        return new Ball().construct(40, 30, size);
      case ShapeTypes.BAR:
        return new Bar().construct(10, 30, 60, size);
      case ShapeTypes.DIAMOND:
        return new Diamond().construct(10, 30, 60, size);
      case ShapeTypes.ELLIPSE:
        return new Ellipse().construct(10, 30, 60, size);
    }
  }

  private _renderNotePreview (): void {
    this._previewCanvas.clear();

    const shape: Shape = this._getShape();
    const effects: Effect[] = this._getEffects();

    for (const effect of effects) {
      shape.pipe(effect);
    }

    shape.update(this._previewCanvas, 1);
  }
}
