import AudioFile from 'Audio/AudioFile';
import Sequence from 'AppCore/MIDI/Sequence';
import { IShapeTemplate, IEffectTemplate } from 'App/State/VisualizationTypes';
import { Extension } from 'Base/Core';

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
  channels: IChannelCustomizer[];
  settings: ICustomizerSettings;
}

export interface IChannelCustomizer {
  shapeCustomizer: IShapeCustomizer;
}

export interface ICustomizerSettings {
  focusDelay: number;
  scrollSpeed: number;
  tempo: number;
}

export interface IShapeCustomizer {
  shapeTemplate: IShapeTemplate;
  effectTemplates: Extension<IEffectTemplate>[];
}
