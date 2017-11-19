type MapIterationHandler<K, V> = (value: V, key: K) => void;
type MapEntry<K, V> = [K, V];
type MapEntryArray<K, V> = MapEntry<K, V>[];

export class Map<K, V> {
  private _entries: MapEntryArray<K, V> = [];

  public constructor (entries: MapEntryArray<K, V> = []) {
    this._entries = entries;
  }

  public entries (): MapEntryArray<K, V> {
    return this._entries;
  }

  public forEach (handler: MapIterationHandler<K, V>): void {
    this._entries.forEach((entry: MapEntry<K, V>) => {
      handler(entry[1], entry[0]);
    });
  }

  public get (key: K): V {
    for (const entry of this._entries) {
      if (entry[0] === key) {
        return entry[1];
      }
    }
  }

  public set (key: K, value: V): void {
    for (const entry of this._entries) {
      if (entry[0] === key) {
        entry[1] = value;

        break;
      }
    }
  }

  public values (): V[] {
    return this._entries.map((entry: MapEntry<K, V>) => entry[1]);
  }
}
