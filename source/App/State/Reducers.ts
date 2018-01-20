import { ActionTypes } from 'App/State/ActionTypes';
import { IAction, IAppState, ViewMode } from 'App/State/Types';
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
  viewMode: ViewMode.CUSTOMIZER
};

function changeTrack (state: IAppState, index: number): IAppState {
  state = syncSelectedTrack(state);
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

function changeView (state: IAppState, viewMode: ViewMode): IAppState {
  return { ...state, viewMode };
}

function cycleTracks (state: IAppState, steps: number): IAppState {
  return changeTrack(state, state.selectedPlaylistTrack.index + steps);
}

function syncSelectedTrack (state: IAppState): IAppState {
  const { audioFile, customizer, index, sequence } = state.selectedPlaylistTrack;

  return {
    ...state,
    playlist: [
      ...state.playlist.slice(0, index - 1),
      { audioFile, customizer, sequence },
      ...state.playlist.slice(index + 1)
    ]
  };
}

function updatedSelectedTrack (state: IAppState, action: IAction): IAppState {
  return {
    ...state,
    selectedPlaylistTrack: action.track
  };
}

export default function appReducer (state: IAppState = initialState, action: IAction): IAppState {
  switch (action.type) {
    case ActionTypes.CHANGE_TRACK:
      return changeTrack(state, action.index);
    case ActionTypes.NEXT_TRACK:
      return cycleTracks(state, +1);
    case ActionTypes.PREVIOUS_TRACK:
      return cycleTracks(state, -1);
    case ActionTypes.SYNC_SELECTED_TRACK:
      return syncSelectedTrack(state);
    case ActionTypes.CHANGE_VIEW:
      return changeView(state, action.viewMode);
    case ActionTypes.UPDATE_SELECTED_TRACK:
      return updatedSelectedTrack(state, action);
    default:
      return state;
  }
}
