import { IConstructable } from '@base';

type PoolableConstructor<T> = IConstructable<IPoolable<T>>;

export interface IPoolable<T> {
  construct (...args: any[]): T;
  destruct (): void;
}

export interface IPoolableFactory<T> {
  request (...args: any[]): IPoolable<T>;
  return (t: IPoolable<T>): void;
}

export default class Pool<T> implements IPoolableFactory<T> {
  private _constructor: PoolableConstructor<T>;
  private _pool: IPoolable<T>[] = [];

  public constructor (constructor: PoolableConstructor<T>, startingSize: number = 0) {
    this._constructor = constructor;

    for (let i = 0; i < startingSize; i++) {
      this._pool.push(new constructor());
    }
  }

  public request (): IPoolable<T> {
    if (this._pool.length > 0) {
      return this._pool.pop();
    }

    return new this._constructor();
  }

  public return (instance: IPoolable<T>): void {
    instance.destruct();

    this._pool.push(instance);
  }
}
