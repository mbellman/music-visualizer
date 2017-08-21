import IDisposable from 'Base/IDisposable';
import IMap from 'Base/IMap';
import Store from 'Base/Store';

interface IViewConstructor {
  new (store: Store): View;
}

const ViewRegistry: IMap<IViewConstructor> = {};

/**
 * @decorator
 */
export function InjectableView (name: string) {
  return <T extends IViewConstructor> (constructor: T) => {
    ViewRegistry[name] = constructor;
  };
}

export abstract class View<T = any> implements IDisposable {
  protected binding: string;
  private _childViews: Array<View> = [];
  private _html: string;
  private _container: Element = document.createElement('div');
  private _store: Store;
  private _parent: Element;

  public constructor (store: Store) {
    this._store = store;
  }

  public update (): this {
    const isFirstUpdate: boolean = !this._html;

    this._html = this.render(this._getContext());
    this._container.innerHTML = this._html;

    this._updateChildViews();

    if (isFirstUpdate) {
      this._subscribeToContextUpdates();
      this.onFirstUpdate();
    }

    return this;
  }

  /**
   * Attaches the View to a new parent element or selector.
   *
   * @param {Element | string} parent
   * @returns {this}
   */
  public attach (parent: Element | string): this {
    this.detach();
    this._setParent(parent);
    this._parent.appendChild(this._container);

    this.onAttach();

    return this;
  }

  public detach (): this {
    if (this._isAttached()) {
      this._parent.removeChild(this._container);

      this.onDetach();
    }

    return this;
  }

  public dispose (): void {
    // Detach, unbind events, etc.
  }

  /**
   * Overridable View lifecycle methods.
   */
  protected onFirstUpdate (): void {}
  protected onRender (): void {}
  protected onAttach (): void {}
  protected onDetach (): void {}

  protected updateContext (data: any): void {
    if (!this.binding) {
      return;
    }

    const context: T = this._getContext();

    this._store.update(this.binding, Object.assign(context, data));
  }

  protected abstract render (context?: T): string;

  private _getContext (): T {
    if (!this.binding) {
      return null;
    }

    return this._store.getState()[this.binding];
  }

  private _setParent (parent: Element | string): void {
    const isSelector: boolean = typeof parent === 'string';

    this._parent = isSelector ? document.querySelector(<string>parent) : <Element>parent;
  }

  private _isAttached (): boolean {
    return this._parent && this._parent.contains(this._container);
  }

  /**
   * An atomic operation for refreshing all child Views,
   * both disposing of the existing ones and re-instantiating
   * new children based on the updated View markup.
   *
   * @private
   */
  private _updateChildViews (): void {
    // Detach and unbind all child Views
    for (const childView of this._childViews) {
      childView.dispose();
    }

    this._childViews.length = 0;

    // Re-attach child Views
    const { slice } = Array.prototype;
    const childViewDirectParents: Array<Element> = slice.call(this._container.querySelectorAll('view'), 0);

    for (const parent of childViewDirectParents) {
      const viewType: string = parent.getAttribute('type');
      const ViewConstructor: IViewConstructor = ViewRegistry[viewType];

      if (ViewConstructor) {
        const view: View = new ViewConstructor(this._store).update();

        parent.parentElement.replaceChild(view._container, parent);
        this._childViews.push(view);
      }
    }
  }

  private _subscribeToContextUpdates (): void {
    if (!this.binding) {
      return;
    }

    this._store.subscribe(this.binding, () => this.update());
  }
}
