import { ActionTypes, IAction, ICustomizerSettingsAction } from '@state/ActionTypes';
import Sequence from '@core/MIDI/Sequence';
import AudioFile from 'Audio/AudioFile';
import { ICustomizerSettings, ViewMode } from '@state/Types';

export namespace ActionCreators {
  export function changeAudioFile (
    audioFile: AudioFile
  ): IAction {
    return {
      type: ActionTypes.CHANGE_AUDIO_FILE,
      payload: audioFile
    };
  }

  export function changeSequence (
    sequence: Sequence
  ): IAction {
    return {
      type: ActionTypes.CHANGE_SEQUENCE,
      payload: sequence
    };
  }

  export function changeView (
    view: ViewMode
  ): IAction {
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

  export function setCustomizerSettings (
    settings: Partial<ICustomizerSettings>
  ): ICustomizerSettingsAction {
    return {
      type: ActionTypes.SET_CUSTOMIZER_SETTINGS,
      ...settings
    };
  }
}
