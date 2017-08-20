import IMap from 'Base/IMap';

type EventCallback = (...args: Array<any>) => void;

export default class EventManager {
  private _events: IMap<Array<EventCallback>>;

  public on (event: string, callback: EventCallback): void {
    if (!this._events[event]) {
      this._events[event] = [];
    }

    this._events[event].push(callback);
  }

  public trigger (event: string, ...args: Array<any>): void {
    const callbacks: Array<EventCallback> = this._events[event];

    for (const callback of callbacks) {
      callback.apply(null, args);
    }
  }
}
