import EventManager from 'Base/EventManager';
import { Callback, IMap } from 'Base/Types';

export default class Store {
  private _eventManager: EventManager = new EventManager();
  private _state: IMap<any>;

  public constructor (state: any = {}) {
    this._state = state;
  }

  public getState (): IMap<any> {
    return this._state;
  }

  public update (prop: string, value: any): void {
    this._state[prop] = value;

    this._eventManager.trigger(prop, value);
  }

  public subscribe (prop: string, callback: Callback<any>): void {
    this._eventManager.on(prop, callback);
  }
}
