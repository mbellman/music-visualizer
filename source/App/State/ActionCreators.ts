import AudioFile from '@core/Audio/AudioFile';
import Sequence from '@core/MIDI/Sequence';
import { ActionTypes, IAction, ICustomizerSettingsAction, IEffectAction, IShapeAction, IChannelAction } from '@state/ActionTypes';
import { AudioControl, ViewMode } from '@state/Types';
import { EffectTypes, ICustomizerSettings, IEffectTemplate, IShapeTemplate } from '@core/Visualization/Types';
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

  export function changeView (viewMode: ViewMode): IAction {
    return {
      type: ActionTypes.CHANGE_VIEW,
      payload: viewMode
    };
  }

  export function controlAudio (audioControl: AudioControl): IAction {
    return {
      type: ActionTypes.CONTROL_AUDIO,
      payload: audioControl
    };
  }

  export function randomizeChannel (channelIndex: number): IChannelAction {
    return {
      type: ActionTypes.RANDOMIZE_CHANNEL,
      channelIndex
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

  export function setEffectTemplateProps (effectType: EffectTypes, channelIndex: number, { ...props }: Partial<Extension<IEffectTemplate>>): IEffectAction {
    return {
      type: ActionTypes.SET_EFFECT_TEMPLATE_PROPS,
      channelIndex,
      effectType,
      ...props
    };
  }

  export function setShapeTemplateProps (channelIndex: number, { ...props }: Partial<IShapeTemplate>): IShapeAction {
    return {
      type: ActionTypes.SET_SHAPE_TEMPLATE_PROPS,
      channelIndex,
      ...props
    };
  }
}
