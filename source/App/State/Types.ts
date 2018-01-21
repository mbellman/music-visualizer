import AudioFile from 'Audio/AudioFile';
import Effect from 'AppCore/Visualization/Effects/Effect';
import Shape from 'AppCore/Visualization/Shapes/Shape';
import Sequence from 'AppCore/MIDI/Sequence';
import { IBar, IBall } from 'App/State/VisualizationTypes';
import { ActionTypes } from 'App/State/ActionTypes';
import { IConstructor, IHashMap } from 'Base/Core';

export interface IAction {
  type: ActionTypes;
  payload?: any;
  [key: string]: any;
}

export interface IAppState {
  playlist: IPlaylistTrack[];
  selectedPlaylistTrack: ISelectedPlaylistTrack;
  viewMode: ViewMode;
}

export interface IChannelCustomizer {
}

export interface ICustomizer {
  channels: IChannelCustomizer[];
  focusDelay: number;
  scrollSpeed: number;
  tempo: number;
}

export interface IPlaylistTrack {
  audioFile: AudioFile;
  customizer: ICustomizer;
  sequence: Sequence;
}

export interface ISelectedPlaylistTrack extends IPlaylistTrack {
  index: number;
}

export enum ViewMode {
  EDITOR,
  PLAYER
}
