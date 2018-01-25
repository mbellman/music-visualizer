import { ActionTypes, IAction, IShapeAction, ICustomizerSettingsAction } from '@state/ActionTypes';
import { IAppState, ViewMode, ICustomizer, IPlaylistTrack, ICustomizerSettings } from '@state/Types';
import { Utils } from '@base';
import { initialState, initialCustomizerState, initialChannelCustomizerState } from '@state/Initializers';
import Sequence from '@core/MIDI/Sequence';

function changeCustomizerProp <K extends keyof ICustomizer>(
  state: IAppState,
  prop: K,
  value: ICustomizer[K]
): IAppState {
  const { customizer } = state.selectedPlaylistTrack;

  return changeSelectedPlaylistTrackProp(state, 'customizer', {
    ...customizer,
    [prop]: value
  });
}

function changeSelectedPlaylistTrackProp <K extends keyof IPlaylistTrack>(
  state: IAppState,
  prop: K,
  value: IPlaylistTrack[K]
): IAppState {
  return {
    ...state,
    selectedPlaylistTrack: {
      ...state.selectedPlaylistTrack,
      [prop]: value
    }
  };
}

function changeSequence (
  state: IAppState,
  sequence: Sequence
): IAppState {
  const { tempo } = sequence;

  state = changeSelectedPlaylistTrackProp(state, 'sequence', sequence);
  state = changeSelectedPlaylistTrackProp(state, 'customizer', initialCustomizerState);
  state = changeCustomizerProp(state, 'channels', [ ...sequence.channels() ].map(channel => initialChannelCustomizerState));
  state = setCustomizerSettings(state, { tempo });

  return state;
}

function jumpToPlaylistTrack (
  state: IAppState,
  index: number
): IAppState {
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

function setCustomizerSettings (
  state: IAppState,
  updatedSettings: Partial<ICustomizerSettings>
): IAppState {
  const { settings } = state.selectedPlaylistTrack.customizer;

  return changeCustomizerProp(state, 'settings', {
    ...settings,
    ...updatedSettings
  });
}

function syncSelectedPlaylistTrack (
  state: IAppState
): IAppState {
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
