import { Store } from 'Base/Store';

export default abstract class View<T = any> {
  private _element: Element = document.createElement('div');
  private _target: Element;

  protected static for<U> (items: Array<U>, handler: (item: U) => string): string {
    return items.map(handler).join('');
  }

  public constructor (protected _store: Store) {}

  public update (): this {
    const html = this.render();

    this._element.innerHTML = html;

    return this;
  }

  public attach (target: Element | string): this {
    this.detach();

    if (typeof target === 'string') {
      target = document.querySelector(target);
    }

    this._target = target;

    this._target.appendChild(this._element);

    return this;
  }

  public detach (): this {
    if (this._isAttached()) {
      this._target.removeChild(this._element);
    }

    return this;
  }

  public put <U extends { new (store: Store): View }>(view: U): string {
    return new view(this._store).update().render();
  }

  public abstract render (): string;

  private _isAttached (): boolean {
    return this._target && this._target.contains(this._element);
  }
}
