import EventManager from 'Base/EventManager';
import { Callback } from 'Base/Types';

export default class Store<T = any> {
  private _eventManager: EventManager = new EventManager();
  private _state: T;

  public constructor (state: T) {
    this._state = state;
  }

  public getState (): T {
    return this._state;
  }

  public update (prop: keyof T, value: any): void {
    this._state[prop] = Object.assign(this._state[prop], value);
  }
}
