import { EffectTypes, ICustomizer, IFillTemplate, IGlowTemplate, IShapeTemplate, IStrokeTemplate, ShapeTypes } from '@core/Visualization/Types';
import { IAppState, ViewMode } from '@state/Types';

export const initialShapeTemplate: IShapeTemplate = {
  shapeType: ShapeTypes.BAR,
  size: 20
};

export const initialGlowTemplate: IGlowTemplate = {
  effectType: EffectTypes.GLOW,
  color: '00f',
  blur: 5,
  fadeIn: 0,
  fadeOut: 0,
  isSelected: false,
  isDelayed: false
};

export const initialFillTemplate: IFillTemplate = {
  effectType: EffectTypes.FILL,
  color: '00f',
  isSelected: true,
  isDelayed: false
};

export const initialStrokeTemplate: IStrokeTemplate = {
  effectType: EffectTypes.STROKE,
  color: '00f',
  width: 2,
  isSelected: false,
  isDelayed: false
};

export const initialCustomizerState: ICustomizer = {
  settings: {
    framerate: 60,
    scrollSpeed: 100,
    focusDelay: 1000,
    tempo: 0,
    width: 1190,
    height: 640
  },
  shapes: {},
  effects: {
    fills: {},
    strokes: {},
    glows: {}
  }
};

export const initialState: IAppState = {
  playlist: [],
  selectedPlaylistTrack: {
    audioFile: null,
    index: 0,
    sequence: null,
    customizer: initialCustomizerState
  },
  viewMode: ViewMode.EDITOR
};
