import DOM from 'Base/DOM';
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

export abstract class View<T = any> {
  protected binding: string;
  private _childViews: Array<View> = [];
  private _html: string;
  private _root: Element = DOM.create('div');
  private _store: Store;

  /**
   * @constructor
   */
  public constructor (store: Store) {
    this._store = store;
  }

  public mount (target: Element | string): void {
    this._attach(target)._update();
  }

  /**
   * Overridable View lifecycle methods.
   */
  protected onAttach (): void {}
  protected onMount (): void {}
  protected onUpdate (): void {}
  protected onDetach (): void {}
  protected onDispose (): void {}

  protected abstract render (context?: T): string;

  protected updateContext (data: any): void {
    if (!this.binding) {
      return;
    }

    const context: T = this._getContext();

    this._store.update(this.binding, Object.assign(context, data));
  }

  protected bind (event: string, selector: string, handler: () => void): void {
    // ...
  }

  protected find (selector: string): Array<Element> {
    return Array.prototype.slice.call(this._root.querySelectorAll(selector), 0);
  }

  private _attach (target: Element | string): this {
    this._detach();

    if (typeof target === 'string') {
      target = DOM.query(target)[0];
    }

    target.appendChild(this._root);

    this.onAttach();

    return this;
  }

  /**
   * Triggers a full View refresh, recursively updating
   * the View's children if any.
   *
   * @private
   */
  private _update (): this {
    const isMounting: boolean = !this._html;

    // View re-render + root replacement. The technique
    // here creates a new wrapper element, renders the
    // updated markup inside it, references the first
    // child element**, and swaps the current root with
    // this element both in the DOM and by reference.
    let newRoot: Element = DOM.create('div');

    newRoot.innerHTML = this._html = this.render(this._getContext());

    if (newRoot.children.length === 1) {
      // **Only re-assign the new root to its first child
      // if exactly one exists. If no child elements or
      // multiple child elements exist, preserve the
      // wrapper element to maintain a single root
      // reference.
      newRoot = newRoot.children[0];
    }

    DOM.replace(this._root, newRoot);

    this._root = newRoot;

    // Remaining post-render operations
    this._updateChildViews();

    if (isMounting) {
      this._subscribeToContextUpdates();
      this.onMount();
    }

    return this;
  }

  /**
   * An atomic operation for refreshing all child Views,
   * both disposing of the existing ones and re-attaching
   * new children contained within the updated View markup.
   *
   * @private
   */
  private _updateChildViews (): void {
    // Detach and unbind all child Views
    for (const childView of this._childViews) {
      childView._dispose();
    }

    this._childViews.length = 0;

    // Attach new child Views
    const childViewTargets: Array<Element> = this.find('view');

    for (const target of childViewTargets) {
      const viewType: string = target.getAttribute('type');
      const ViewConstructor: IViewConstructor = ViewRegistry[viewType];

      if (ViewConstructor) {
        const view: View = new ViewConstructor(this._store);

        DOM.replace(target, view._root);
        view._update();
        this._childViews.push(view);
      }
    }
  }

  private _subscribeToContextUpdates (): void {
    if (!this.binding) {
      return;
    }

    this._store.subscribe(this.binding, () => this._update());
  }

  private _detach (): this {
    if (this._isAttached()) {
      DOM.remove(this._root);

      this.onDetach();
    }

    return this;
  }

  private _dispose (): void {
    this.onDispose();

    // Detach, unbind events, etc.
  }

  private _getContext (): T {
    if (!this.binding) {
      return null;
    }

    return this._store.getState()[this.binding];
  }

  private _isAttached (): boolean {
    return !!this._root.parentElement;
  }
}
