export type Callback<T, U = any> = (value: T) => U;

export interface IMap<T> {
  [key: string]: T;
}
