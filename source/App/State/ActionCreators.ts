import { ActionTypes, IAction, ICustomizerSettingsAction, IChannelAction, IEffectAction, IShapeAction } from '@state/ActionTypes';
import Sequence from '@core/MIDI/Sequence';
import AudioFile from 'Audio/AudioFile';
import { ICustomizerSettings, ViewMode } from '@state/Types';
import { IEffectTemplate, IShapeTemplate, EffectTypes } from '@state/VisualizationTypes';
import { Extension } from '@base';

export namespace ActionCreators {
  export function changeAudioFile (audioFile: AudioFile): IAction {
    return {
      type: ActionTypes.CHANGE_AUDIO_FILE,
      payload: audioFile
    };
  }

  export function changeSequence (sequence: Sequence): IAction {
    return {
      type: ActionTypes.CHANGE_SEQUENCE,
      payload: sequence
    };
  }

  export function changeView (view: ViewMode): IAction {
    return {
      type: ActionTypes.CHANGE_VIEW,
      payload: view
    };
  }

  export function resetCustomizer (): IAction {
    return {
      type: ActionTypes.RESET_CUSTOMIZER
    };
  }

  export function setCustomizerSettings (settings: Partial<ICustomizerSettings>): ICustomizerSettingsAction {
    return {
      type: ActionTypes.SET_CUSTOMIZER_SETTINGS,
      ...settings
    };
  }

  export function setEffectTemplateProps (channelIndex: number, effectType: EffectTypes, { ...props }: Partial<Extension<IEffectTemplate>>): IEffectAction {
    return {
      type: ActionTypes.SET_EFFECT_TEMPLATE_PROPS,
      index: channelIndex,
      effectType,
      ...props
    };
  }

  export function setShapeTemplateProps (channelIndex: number, { ...props }: Partial<IShapeTemplate>): IShapeAction {
    return {
      type: ActionTypes.SET_SHAPE_TEMPLATE_PROPS,
      index: channelIndex,
      ...props
    };
  }
}
