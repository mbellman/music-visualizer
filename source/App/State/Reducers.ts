import { ActionTypes, IAction, IShapeAction, ICustomizerSettingsAction, IChannelAction } from '@state/ActionTypes';
import { IAppState, ViewMode, ICustomizer, IPlaylistTrack, ICustomizerSettings, ShapeTemplateHashMap, EffectTemplatesHashMap } from '@state/Types';
import { Utils } from '@base';
import { initialState, initialCustomizerState, initialShapeTemplate, initialEffectTemplates } from '@state/Initializers';
import Sequence from '@core/MIDI/Sequence';
import { Shapes, IShapeTemplate, IEffectTemplate } from '@state/VisualizationTypes';
import { IHashMap } from 'Base/Types';

function changeCustomizerProp <K extends keyof ICustomizer>(state: IAppState, prop: K, value: ICustomizer[K]): IAppState {
  const { customizer } = state.selectedPlaylistTrack;

  return changeSelectedPlaylistTrackProp(state, 'customizer', {
    ...customizer,
    [prop]: value
  });
}

function changeSelectedPlaylistTrackProp <K extends keyof IPlaylistTrack>(state: IAppState, prop: K, value: IPlaylistTrack[K]): IAppState {
  return {
    ...state,
    selectedPlaylistTrack: {
      ...state.selectedPlaylistTrack,
      [prop]: value
    }
  };
}

function changeSequence (state: IAppState, sequence: Sequence): IAppState {
  const { tempo } = sequence;
  const shapeTemplates: ShapeTemplateHashMap = {};
  const effectTemplates: EffectTemplatesHashMap = {};

  [ ...sequence.channels() ].forEach((channel, index) => {
    shapeTemplates[index] = initialShapeTemplate;
    effectTemplates[index] = initialEffectTemplates;
  });

  state = changeSelectedPlaylistTrackProp(state, 'sequence', sequence);
  state = changeSelectedPlaylistTrackProp(state, 'customizer', initialCustomizerState);
  state = changeCustomizerProp(state, 'shapeTemplates', shapeTemplates);
  state = changeCustomizerProp(state, 'effectTemplates', effectTemplates);
  state = setCustomizerSettings(state, { tempo });

  return state;
}

function changeShape (state: IAppState, channelIndex: number, shape: Shapes): IAppState {
  const { selectedPlaylistTrack } = state;
  const { customizer } = selectedPlaylistTrack;
  const { shapeTemplates } = customizer;

  return {
    ...state,
    selectedPlaylistTrack: {
      ...selectedPlaylistTrack,
      customizer: {
        ...customizer,
        shapeTemplates: {
          ...shapeTemplates,
          [channelIndex]: {
            type: shape,
            size: 20
          }
        }
      }
    }
  };
}

function jumpToPlaylistTrack (state: IAppState, index: number): IAppState {
  state = syncSelectedPlaylistTrack(state);
  index = Utils.wrap(index, 0, state.playlist.length - 1);

  const { audioFile, customizer, sequence } = state.playlist[index];

  return {
    ...state,
    selectedPlaylistTrack: {
      audioFile,
      customizer,
      index,
      sequence
    }
  };
}

function setCustomizerSettings (state: IAppState, updatedSettings: Partial<ICustomizerSettings>): IAppState {
  const { settings } = state.selectedPlaylistTrack.customizer;

  return changeCustomizerProp(state, 'settings', {
    ...settings,
    ...updatedSettings
  });
}

function syncSelectedPlaylistTrack (state: IAppState): IAppState {
  const { audioFile, customizer, index, sequence } = state.selectedPlaylistTrack;

  return {
    ...state,
    playlist: [
      ...state.playlist.slice(0, index),
      {
        audioFile,
        customizer,
        sequence
      },
      ...state.playlist.slice(index + 1)
    ]
  };
}

export function appReducer (state: IAppState = initialState, action: IAction): IAppState {
  switch (action.type) {
    case ActionTypes.CHANGE_AUDIO_FILE:
      return changeSelectedPlaylistTrackProp(state, 'audioFile', action.payload);
    case ActionTypes.CHANGE_SHAPE:
      const { index, payload } = action as IChannelAction;

      return changeShape(state, index, payload);
    case ActionTypes.CHANGE_SEQUENCE:
      return changeSequence(state, action.payload);
    case ActionTypes.CHANGE_VIEW:
      return {
        ...state,
        viewMode: action.payload
      };
    case ActionTypes.JUMP_TO_PLAYLIST_TRACK:
      return jumpToPlaylistTrack(state, action.payload);
    case ActionTypes.NEXT_PLAYLIST_TRACK:
      return jumpToPlaylistTrack(state, state.selectedPlaylistTrack.index + 1);
    case ActionTypes.PREVIOUS_PLAYLIST_TRACK:
      return jumpToPlaylistTrack(state, state.selectedPlaylistTrack.index - 1);
    case ActionTypes.RESET_CUSTOMIZER:
      return changeSelectedPlaylistTrackProp(state, 'customizer', initialCustomizerState);
    case ActionTypes.SET_CUSTOMIZER_SETTINGS:
      const { type, ...settings } = action as ICustomizerSettingsAction;

      return setCustomizerSettings(state, settings);
    case ActionTypes.SYNC_SELECTED_PLAYLIST_TRACK:
      return syncSelectedPlaylistTrack(state);
    default:
      return state;
  }
}
