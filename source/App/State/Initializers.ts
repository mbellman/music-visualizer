import { IAppState, ICustomizer, ViewMode, IChannelCustomizer } from '@state/Types';
import { Effects, Shapes } from '@state/VisualizationTypes';

export const initialChannelCustomizerState: IChannelCustomizer = {
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

export const initialCustomizerState: ICustomizer = {
  channels: [],
  settings: {
    focusDelay: 1000,
    scrollSpeed: 100,
    tempo: 0
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
