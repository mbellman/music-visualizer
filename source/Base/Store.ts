import EventManager from 'Base/EventManager';
import IMap from 'Base/IMap';

export class Store {
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

interface IStoreContainer {
  new (...args: any[]): any;
}

export function subscribe (prop: string) {
  return (target: any, method: string) => {
    console.log(target);
    console.log(method);
    target._store.on(prop, (value: any) => target[method](value));
  };
}
