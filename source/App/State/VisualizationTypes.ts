import { IColor } from 'Graphics/Types';

/**
 * Shapes
 * ------
 */
interface IShape {
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
interface IEffect {
  color: IColor;
}

export interface IGlow extends IEffect {
  blur: number;
}
