import IDisposable from 'Base/IDisposable';
import IMap from 'Base/IMap';
import Store from 'Base/Store';

interface IViewConstructor {
  new (store: Store): View;
}

const ViewRegistry: IMap<IViewConstructor> = {};

export function InjectableView (name: string) {
  return <T extends IViewConstructor>(constructor: T) => {
    ViewRegistry[name] = constructor;
  };
}

export abstract class View<T = any> implements IDisposable {
  protected binding: string;
  private _childViews: Array<View> = [];
  private _html: string;
  private _root: Element = document.createElement('div');
  private _store: Store;

  public constructor (store: Store) {
    this._store = store;
  }

  public mount (target: Element | string): void {
    this.attach(target).update();
  }

  public update (): this {
    const isFirstUpdate: boolean = !this._html;
    const newRoot: Element = document.createElement('div');

    this._html = this.render(this._getContext());
    newRoot.innerHTML = this._html;

    const child: Element = newRoot.children[0];

    this._root.parentElement.replaceChild(child, this._root);

    this._root = child;

    this._updateChildViews();

    if (isFirstUpdate) {
      this._subscribeToContextUpdates();
      this.onFirstUpdate();
    }

    return this;
  }

  /**
   * Attaches the View to a new target element or selector.
   *
   * @param {Element | string} target
   * @returns {this}
   */
  public attach (target: Element | string): this {
    this.detach();

    if (typeof target === 'string') {
      target = document.querySelector(target);
    }

    target.appendChild(this._root);

    this.onAttach();

    return this;
  }

  public detach (): this {
    if (this._isAttached()) {
      this._root.parentElement.removeChild(this._root);

      this.onDetach();
    }

    return this;
  }

  public dispose (): void {
    this.onDispose();

    // Detach, unbind events, etc.
  }

  /**
   * Overridable View lifecycle methods.
   */
  protected onFirstUpdate (): void {}
  protected onRender (): void {}
  protected onAttach (): void {}
  protected onDetach (): void {}
  protected onDispose (): void {}

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

  private _isAttached (): boolean {
    return !!this._root.parentElement;
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
    const childViewTargets: Array<Element> = slice.call(this._root.querySelectorAll('view'), 0);

    for (const target of childViewTargets) {
      const viewType: string = target.getAttribute('type');
      const ViewConstructor: IViewConstructor = ViewRegistry[viewType];

      if (ViewConstructor) {
        const view: View = new ViewConstructor(this._store);

        target.parentElement.replaceChild(view._root, target);
        this._childViews.push(view);

        view.update();
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
