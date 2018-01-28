import AudioFile from 'Audio/AudioFile';
import Sequence from '@core/MIDI/Sequence';
import { EffectTypes, ICustomizer, IFillTemplate, IGlowTemplate, IShapeTemplate, IStrokeTemplate } from '@core/Visualization/Types';
import { Extension, IHashMap } from '@base';

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
  PLAYER
}
