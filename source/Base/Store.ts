import EventManager from 'Base/EventManager';
import { Callback } from 'Base/Types';

export default abstract class Store<T = any> {
  private _eventManager: EventManager = new EventManager();
  private _state: T;

  public constructor (state: T) {
    this._state = state;
  }

  public subscribe (prop: keyof T, callback: Callback<any>): void {
    this._eventManager.on(prop, callback);
  }

  protected getState (): T {
    return this._state;
  }

  protected update (prop: keyof T, value: any): void {
    this._state[prop] = Object.assign(this._state[prop], value);

    this._eventManager.trigger(prop, value);
  }
}
