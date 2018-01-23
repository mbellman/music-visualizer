import { IEffectTemplate, IShapeTemplate } from 'App/State/VisualizationTypes';

export enum ActionTypes {
  ADD_CHANNEL_SHAPE,
  ADD_CHANNEL_EFFECT,
  CHANGE_AUDIO_FILE,
  CHANGE_CUSTOMIZER_FOCUS_DELAY,
  CHANGE_CUSTOMIZER_SCROLL_SPEED,
  CHANGE_SEQUENCE,
  CHANGE_CUSTOMIZER_TEMPO,
  CHANGE_VIEW,
  JUMP_TO_PLAYLIST_TRACK,
  NEXT_PLAYLIST_TRACK,
  PREVIOUS_PLAYLIST_TRACK,
  SYNC_SELECTED_PLAYLIST_TRACK,
  UPDATE_SELECTED_PLAYLIST_TRACK
}

export interface IAction {
  type: ActionTypes;
  payload?: any;
  [key: string]: any;
}

export interface IChannelAction extends IAction {
  index: number;
}

export interface IEffectAction extends IChannelAction {
  effect: IEffectTemplate;
}

export interface IShapeAction extends IChannelAction {
  shape: IShapeTemplate;
}
