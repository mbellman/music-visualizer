export type Callback<T, U = any> = (...value: T[]) => U;

export interface IConstructor<T> {
  new (...args: any[]): T;
}

export interface IHashMap<V> {
  [key: string]: V;
  [key: number]: V;
}

export type Partial<T> = {
  [K in keyof T]?: T[K];
};
