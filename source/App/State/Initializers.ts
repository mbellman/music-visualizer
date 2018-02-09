import Sequence from '@core/MIDI/Sequence';
import { EffectTypes, ICustomizer, IFillTemplate, IGlowTemplate, IShapeTemplate, IStrokeTemplate, ShapeTypes } from '@core/Visualization/Types';
import { IAppState, ViewMode } from '@state/Types';

export const initialShapeTemplate: IShapeTemplate = {
  shapeType: ShapeTypes.BAR,
  size: 20
};

export const initialGlowTemplate: IGlowTemplate = {
  effectType: EffectTypes.GLOW,
  color: '00f',
  blur: 15,
  isSelected: false,
  isDelayed: true
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
    backgroundColor: '000',
    scrollSpeed: 100,
    tempoFactor: 100,
    noteSpread: 1.5,
    focusDelay: 2500,
    audioDelay: 1000,
    width: 1280,
    height: 720
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
  viewMode: ViewMode.FILE_DROPPER
};
