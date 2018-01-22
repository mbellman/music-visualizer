import { IColor } from 'Graphics/Types';

/**
 * Shapes
 * ------
 */
export interface IShape {
  x: number;
  y: number;
}

export interface IBar extends IShape {
  width: number;
  height: number;
}

export interface IBall extends IShape {
  radius: number;
}

/**
 * Effects
 * -------
 */
export interface IEffect {
  isDelayed: boolean;
  isSelected: boolean;
}

export interface IColorableEffect extends IEffect {
  color: string;
}

export interface IFill extends IColorableEffect {}

export interface IGlow extends IColorableEffect {
  blur: number;
}

export interface IStroke extends IColorableEffect {
  width: number;
}
