import AudioFile from 'Audio/AudioFile';
import Sequence from 'AppCore/MIDI/Sequence';
import { IConstructor, IHashMap } from 'Base/Core';

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
