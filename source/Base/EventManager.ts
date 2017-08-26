import IMap from 'Base/IMap';

type EventCallback = (...args: any[]) => void;

export default class EventManager {
  private _events: IMap<EventCallback[]> = {};

  public on (event: string, callback: EventCallback): void {
    this._checkEvent(event);

    this._events[event].push(callback);
  }

  public trigger (event: string, ...args: any[]): void {
    this._checkEvent(event);

    const callbacks: EventCallback[] = this._events[event];

    for (const callback of callbacks) {
      callback.apply(null, args);
    }
  }

  private _checkEvent (event: string): void {
    if (!this._events[event]) {
      this._events[event] = [];
    }
  }
}
