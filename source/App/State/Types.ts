import AudioFile from 'Audio/AudioFile';
import Sequence from 'AppCore/MIDI/Sequence';
import { IShapeTemplate, IEffectTemplate } from 'App/State/VisualizationTypes';
import { Extension } from 'Base/Core';
import { IHashMap } from 'Base/Types';

export type ShapeTemplateHashMap = IHashMap<IShapeTemplate>;
export type EffectTemplatesHashMap = IHashMap<IEffectTemplate[]>;

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
  shapeTemplates: ShapeTemplateHashMap;
  effectTemplates: EffectTemplatesHashMap;
}

export interface ICustomizerSettings {
  focusDelay: number;
  scrollSpeed: number;
  tempo: number;
}
