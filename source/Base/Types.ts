export type Callback<T, U = any> = (...value: T[]) => U;
export type Constructor<T> = { new (...args: any[]): T } | Function & { prototype: T };
export type Extension<T> = T & IHashMap<any>;

export interface IHashMap<V> {
  [key: string]: V;
  [key: number]: V;
}
