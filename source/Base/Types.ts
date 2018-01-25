export type Constructor<T> = { new (...args: any[]): T; } | Function & { prototype: T };
export type Extension<T> = T & IHashMap<any>;
export type Method<T, U = any> = (...args: T[]) => U;
export type Callback<T, U = any> = Method<T, U>;

export interface IHashMap<V> {
  [key: string]: V;
  [key: number]: V;
}
