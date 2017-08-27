import { Callback, IMap } from 'Base/Types';

type EventHandler = Callback<any[]>;

export default class EventManager {
  private _events: IMap<EventHandler[]> = {};

  public on (event: any, callback: EventHandler): void {
    this._checkEvent(event);

    this._events[event].push(callback);
  }

  public trigger (event: any, ...args: any[]): void {
    this._checkEvent(event);

    const callbacks: EventHandler[] = this._events[event];

    for (const callback of callbacks) {
      callback.apply(null, args);
    }
  }

  private _checkEvent (event: any): void {
    if (!this._events[event]) {
      this._events[event] = [];
    }
  }
}
