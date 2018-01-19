import Effect from 'AppCore/Visualization/Effects/Effect';
import Shape from 'AppCore/Visualization/Shapes/Shape';
import { IConstructor } from 'Base/Core';

export default class ChannelOptions {
  private _shapeConstructor: IConstructor<Shape>;
  private _effectConstructors: IConstructor<Effect>[] = [];

  public addEffect (effectConstructor: IConstructor<Effect>): void {

  }

  public removeEffect (effectConstructor: IConstructor<Effect>): void {

  }

  public setShape (shapeConstructor: IConstructor<Shape>): void {
    this._shapeConstructor = shapeConstructor;
  }
}
