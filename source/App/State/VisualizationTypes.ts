import { IColor } from 'Graphics/Types';

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
