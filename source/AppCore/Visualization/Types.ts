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
  FILL,
  STROKE,
  GLOW
}

export interface IEffectTemplate {
  effectType: EffectTypes;
  isSelected: boolean;
  isDelayed: boolean;
}

export interface IColorableEffectTemplate extends IEffectTemplate {
  color: string;
}

export interface IFillTemplate extends IColorableEffectTemplate {
  effectType: EffectTypes.FILL;
}

export interface IStrokeTemplate extends IColorableEffectTemplate {
  effectType: EffectTypes.STROKE;
  width: number;
}

export interface IGlowTemplate extends IColorableEffectTemplate {
  effectType: EffectTypes.GLOW;
  blur: number;
  fadeIn?: number;
  fadeOut?: number;
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
  focusDelay: number;
  scrollSpeed: number;
  tempo: number;
}

export interface IEffectsCustomizer {
  fills: IHashMap<IFillTemplate>;
  strokes: IHashMap<IStrokeTemplate>;
  glows: IHashMap<IGlowTemplate>;
}
