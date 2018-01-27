import { IEffectTemplate, IShapeTemplate } from '@state/VisualizationTypes';
import { ICustomizer, ICustomizerSettings } from '@state/Types';

export enum ActionTypes {
  CHANGE_AUDIO_FILE,
  CHANGE_SEQUENCE,
  CHANGE_VIEW,
  JUMP_TO_PLAYLIST_TRACK,
  NEXT_PLAYLIST_TRACK,
  PREVIOUS_PLAYLIST_TRACK,
  RESET_CUSTOMIZER,
  SET_CUSTOMIZER_SETTINGS,
  SET_EFFECT_TEMPLATE_PROPS,
  SET_SHAPE_TEMPLATE_PROPS,
  SYNC_SELECTED_PLAYLIST_TRACK
}

export interface IAction {
  type: ActionTypes;
  payload?: any;
}

export interface ICustomizerSettingsAction extends IAction, Partial<ICustomizerSettings> {
  type: ActionTypes.SET_CUSTOMIZER_SETTINGS;
}

export interface IChannelAction extends IAction {
  index: number;
}

export type IShapeAction = IChannelAction & Partial<IShapeTemplate>;
export type IEffectAction = IChannelAction & Partial<IEffectTemplate>;
