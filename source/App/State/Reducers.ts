import { ActionTypes } from 'App/State/ActionTypes';
import { IAction, IAppState, ViewMode, ICustomizer, IPlaylistTrack } from 'App/State/Types';
import { Utils } from 'Base/Core';

const initialState: IAppState = {
  playlist: [],
  selectedPlaylistTrack: {
    audioFile: null,
    index: 0,
    sequence: null,
    customizer: {
      channels: [],
      focusDelay: 1000,
      scrollSpeed: 100,
      tempo: 0
    }
  },
  viewMode: ViewMode.EDITOR
};

function changeCustomizerProp (state: IAppState, prop: keyof ICustomizer, value: string): IAppState {
  const { customizer } = state.selectedPlaylistTrack;

  return changeSelectedPlaylistTrackProp(state, 'customizer', {
    ...customizer,
    [prop]: value
  });
}

function changeSelectedPlaylistTrackProp (state: IAppState, prop: keyof IPlaylistTrack, value: any): IAppState {
  return {
    ...state,
    selectedPlaylistTrack: {
      ...state.selectedPlaylistTrack,
      [prop]: value
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

function syncSelectedPlaylistTrack (state: IAppState): IAppState {
  const { audioFile, customizer, index, sequence } = state.selectedPlaylistTrack;

  return {
    ...state,
    playlist: [
      ...state.playlist.slice(0, index - 1),
      {
        audioFile,
        customizer,
        sequence
      },
      ...state.playlist.slice(index + 1)
    ]
  };
}

export default function appReducer (state: IAppState = initialState, action: IAction): IAppState {
  switch (action.type) {
    case ActionTypes.CHANGE_AUDIO_FILE:
      return changeSelectedPlaylistTrackProp(state, 'audioFile', action.payload);
    case ActionTypes.CHANGE_CUSTOMIZER_FOCUS_DELAY:
      return changeCustomizerProp(state, 'focusDelay', action.payload);
    case ActionTypes.CHANGE_CUSTOMIZER_SCROLL_SPEED:
      return changeCustomizerProp(state, 'scrollSpeed', action.payload);
    case ActionTypes.CHANGE_SEQUENCE:
      return changeSelectedPlaylistTrackProp(state, 'sequence', action.payload);
    case ActionTypes.CHANGE_CUSTOMIZER_TEMPO:
      return changeCustomizerProp(state, 'tempo', action.payload);
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
    case ActionTypes.SYNC_SELECTED_PLAYLIST_TRACK:
      return syncSelectedPlaylistTrack(state);
    default:
      return state;
  }
}
