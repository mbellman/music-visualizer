export type Callback<T, U = any> = (...value: T[]) => U;

export interface IConstructor<T> {
  new (): T;
}

export interface IHashMap<V> {
  [key: string]: V;
  [key: number]: V;
}
