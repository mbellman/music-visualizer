import AudioFile from 'Audio/AudioFile';
import Effect from 'AppCore/Visualization/Effects/Effect';
import Shape from 'AppCore/Visualization/Shapes/Shape';
import Sequence from 'AppCore/MIDI/Sequence';
import { IConstructor, MultiMap } from 'Base/Core';

export interface IAppState {
  currentMusicTrackIndex: number;
  musicTracks: IMusicTrack[];
  viewMode: ViewMode;
}

export interface IChannelCustomization {
  shapes: IConstructor<Shape>[];
  effects: MultiMap<number, IConstructor<Effect>>;
}

export interface IMusicTrack {
  audioFile?: AudioFile;
  sequenceCustomization?: ISequenceCustomization;
  sequence?: Sequence;
}

export interface ISequenceCustomization {
  tempo: number;
  channelCustomizations: IChannelCustomization[];
}

export enum ViewMode {
  CUSTOMIZER,
  VISUALIZATION
}
