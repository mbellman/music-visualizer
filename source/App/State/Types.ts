import AudioFile from 'Audio/AudioFile';
import Sequence from '@core/MIDI/Sequence';
import { ICustomizer } from '@core/Visualization/Types';

export interface IAppState {
  playlist: IPlaylistTrack[];
  selectedPlaylistTrack: ISelectedPlaylistTrack;
  viewMode: ViewMode;
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
  FILE_DROPPER,
  PLAYER
}

export enum AudioControl {
  PLAY,
  PAUSE,
  RESTART,
  STOP
}
