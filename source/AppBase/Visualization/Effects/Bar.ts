import Effect from 'AppBase/Visualization/Effects/Effect';
import Visualizer from 'AppBase/Visualizer';
import { Implementation } from 'Base/Decorators';

export default class Bar extends Effect {
  private _x: number;
  private _y: number;

  @Implementation
  protected onUpdate (visualizer: Visualizer): void {
    this._x -= Math.round(visualizer.tempo / 20);
  }
}
