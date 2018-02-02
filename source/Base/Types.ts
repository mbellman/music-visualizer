export type Constructor<T> = IConstructable<T> | Function & { prototype: T };
export type Extension<T> = T & IHashMap<any>;
export type Method<T, U = any> = (...args: T[]) => U;
export type Callback<T, U = any> = Method<T, U>;

export interface IConstructable<T> {
  new (...args: any[]): T;
}

export interface IHashMap<V> {
  [key: string]: V;
  [key: number]: V;
}
