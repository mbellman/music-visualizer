import AudioFile from 'Audio/AudioFile';
import Sequence from '@core/MIDI/Sequence';
import { IShapeTemplate, IFillTemplate, IStrokeTemplate, IGlowTemplate, EffectTypes } from '@state/VisualizationTypes';
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

export interface ICustomizer {
  settings: ICustomizerSettings;
  shapes: IHashMap<IShapeTemplate>;
  effects: IEffectsCustomizer;
}

export interface ICustomizerSettings {
  focusDelay: number;
  scrollSpeed: number;
  tempo: number;
}

export interface IEffectsCustomizer {
  fills: IHashMap<IFillTemplate>;
  strokes: IHashMap<IStrokeTemplate>;
  glows: IHashMap<IGlowTemplate>;
}
