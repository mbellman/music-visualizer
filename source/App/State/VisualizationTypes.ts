import { IColor } from 'Graphics/Types';

/**
 * Shapes
 * ------
 */
export enum Shapes {
  BAR,
  BALL
}

export interface IShapeTemplate {
  type: Shapes;
  size: number;
}

/**
 * Effects
 * -------
 */
export enum Effects {
  FILL,
  STROKE,
  GLOW
}

export interface IEffectTemplate {
  type: Effects;
  isDelayed: boolean;
  [key: string]: any;
}

export interface IColorableEffectTemplate extends IEffectTemplate {
  color: string;
}

export interface IFillTemplate extends IColorableEffectTemplate {
  type: Effects.FILL;
}

export interface IGlowTemplate extends IColorableEffectTemplate {
  type: Effects.GLOW;
  blur: number;
  fadeIn?: number;
  fadeOut?: number;
}

export interface IStrokeTemplate extends IColorableEffectTemplate {
  type: Effects.STROKE;
  width: number;
}
