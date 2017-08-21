import EventManager from 'Base/EventManager';
import IMap from 'Base/IMap';

export default class Store {
  private _eventManager: EventManager = new EventManager();

  public constructor (private _state: IMap<any>) {}

  public getState (): IMap<any> {
    return this._state;
  }

  public update (prop: string, value: any): void {
    this._state[prop] = value;

    this._eventManager.trigger(prop, value);
  }

  public subscribe (prop: string, callback: (value: any) => void): void {
    this._eventManager.on(prop, callback);
  }
}
