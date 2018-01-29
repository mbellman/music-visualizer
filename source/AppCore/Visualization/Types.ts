import { IColor } from 'Graphics/Types';
import { IHashMap } from '@base';

/**
 * Shapes
 * ------
 */
export enum ShapeTypes {
  BAR,
  BALL
}

export interface IShapeTemplate {
  shapeType: ShapeTypes;
  size: number;
}

/**
 * Effects
 * -------
 */
export enum EffectTypes {
  GLOW,
  FILL,
  STROKE
}

export interface IEffectTemplate {
  effectType: EffectTypes;
  isSelected: boolean;
  isDelayed: boolean;
}

export interface IColorableEffectTemplate extends IEffectTemplate {
  color: string;
}

export interface IGlowTemplate extends IColorableEffectTemplate {
  effectType: EffectTypes.GLOW;
  blur: number;
  fadeIn?: number;
  fadeOut?: number;
}

export interface IFillTemplate extends IColorableEffectTemplate {
  effectType: EffectTypes.FILL;
}

export interface IStrokeTemplate extends IColorableEffectTemplate {
  effectType: EffectTypes.STROKE;
  width: number;
}

/**
 * Customizer types
 * ----------------
 */
export interface ICustomizer {
  settings: ICustomizerSettings;
  shapes: IHashMap<IShapeTemplate>;
  effects: IEffectsCustomizer;
}

export interface ICustomizerSettings {
  framerate: 30 | 60;
  scrollSpeed: number;
  focusDelay: number;
  tempo: number;
  width: number;
  height: number;
}

export interface IEffectsCustomizer {
  glows: IHashMap<IGlowTemplate>;
  fills: IHashMap<IFillTemplate>;
  strokes: IHashMap<IStrokeTemplate>;
}
