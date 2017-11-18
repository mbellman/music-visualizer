import { Callback, IHashMap } from 'Base/Types';

type EventHandler = Callback<any>;

export default class EventManager {
  private _events: IHashMap<EventHandler[]> = {};

  public on (event: any, callback: EventHandler): void {
    this._verifyEvent(event);

    this._events[event].push(callback);
  }

  public trigger (event: any, ...args: any[]): void {
    this._verifyEvent(event);

    const callbacks: EventHandler[] = this._events[event];

    for (const callback of callbacks) {
      callback.apply(null, args);
    }
  }

  private _verifyEvent (event: any): void {
    if (!this._events[event]) {
      this._events[event] = [];
    }
  }
}
