import { ActionTypes, IAction, ICustomizerSettingsAction, IChannelAction } from '@state/ActionTypes';
import Sequence from '@core/MIDI/Sequence';
import AudioFile from 'Audio/AudioFile';
import { ICustomizerSettings, ViewMode } from '@state/Types';
import { Shapes } from '@state/VisualizationTypes';

export namespace ActionCreators {
  export function changeAudioFile (audioFile: AudioFile): IAction {
    return {
      type: ActionTypes.CHANGE_AUDIO_FILE,
      payload: audioFile
    };
  }

  export function changeShape (channelIndex: number, shape: Shapes): IChannelAction {
    return {
      type: ActionTypes.CHANGE_SHAPE,
      index: channelIndex,
      payload: shape
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
}
