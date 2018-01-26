import { IAppState, ICustomizer, ViewMode } from '@state/Types';
import { Effects, Shapes, IShapeTemplate, IEffectTemplate } from '@state/VisualizationTypes';
import { Extension } from '@base';

export const initialShapeTemplate: IShapeTemplate = {
  type: Shapes.BAR,
  size: 20
};

export const initialEffectTemplates: Extension<IEffectTemplate>[] = [
  {
    type: Effects.FILL,
    color: '00f',
    isDelayed: false
  }
];

export const initialCustomizerState: ICustomizer = {
  settings: {
    focusDelay: 1000,
    scrollSpeed: 100,
    tempo: 0
  },
  shapeTemplates: {},
  effectTemplates: {}
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
