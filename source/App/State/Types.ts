import AudioFile from 'Audio/AudioFile';
import Sequence from 'AppCore/MIDI/Sequence';
import { IShapeTemplate, IEffectTemplate } from 'App/State/VisualizationTypes';
import { Extension } from 'Base/Core';

export interface IAppState {
  playlist: IPlaylistTrack[];
  selectedPlaylistTrack: ISelectedPlaylistTrack;
  viewMode: ViewMode;
}

export interface IChannelCustomizer {
  shapeCustomizer: IShapeCustomizer;
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

export interface IShapeCustomizer {
  shapeTemplate: IShapeTemplate;
  effectTemplates: Extension<IEffectTemplate>[];
}

export enum ViewMode {
  EDITOR,
  PLAYER
}
