import { IEffectTemplate, IShapeTemplate } from '@state/VisualizationTypes';
import { ICustomizer, ICustomizerSettings } from '@state/Types';

export enum ActionTypes {
  ADD_CHANNEL_EFFECT,
  CHANGE_AUDIO_FILE,
  CHANGE_SHAPE,
  CHANGE_SEQUENCE,
  CHANGE_VIEW,
  JUMP_TO_PLAYLIST_TRACK,
  NEXT_PLAYLIST_TRACK,
  PREVIOUS_PLAYLIST_TRACK,
  RESET_CUSTOMIZER,
  SET_CUSTOMIZER_SETTINGS,
  SYNC_SELECTED_PLAYLIST_TRACK
}

export interface IAction {
  type: ActionTypes;
  payload?: any;
}

export interface ICustomizerSettingsAction extends Partial<ICustomizerSettings> {
  type: ActionTypes.SET_CUSTOMIZER_SETTINGS;
}

export interface IChannelAction extends IAction {
  index: number;
}

export interface IEffectAction extends IChannelAction {
  effectTemplate: IEffectTemplate;
}

export interface IShapeAction extends IChannelAction {
  shapeTemplate: IShapeTemplate;
}
