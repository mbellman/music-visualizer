import '@styles/NotePreview.less';

import { h, Component } from 'preact';
import { Extension, Implementation, Override } from '@base';
import Canvas, { DrawSetting } from 'Graphics/Canvas';
import { Connect } from '@components/Toolkit/Decorators';
import { IAppState } from '@state/Types';
import { Selectors } from '@state/Selectors';
import { ShapeTypes, EffectTypes, IFillTemplate, IShapeTemplate, IEffectTemplate } from '@state/VisualizationTypes';

interface INotePreviewPropsFromState {
  shapeTemplate: IShapeTemplate;
  effectTemplates: Extension<IEffectTemplate>[];
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
export default class NotePreview extends Component<any, any> {
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
