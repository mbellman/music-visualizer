import DOM from 'Base/DOM';
import IMap from 'Base/IMap';
import Store from 'Base/Store';

type UIEventHandler = (e: UIEvent) => any;

interface IEventBinding {
  event: string;
  handler: UIEventHandler;
}

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
  private static _appRoot: Element = DOM.create('div');
  protected context: string;
  private _childViews: View[] = [];
  private _eventBindings: IEventBinding[] = [];
  private _html: string;
  private _root: Element = DOM.create('div');
  private _store: Store;

  public constructor (store: Store) {
    this._store = store;
  }

  public mount (target: Element | string): void {
    if (typeof target === 'string') {
      target = DOM.query(target)[0];
    }

    target.appendChild(View._appRoot);
    this._attach(View._appRoot)._update();
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

  protected updateStore (key: string, data: any): void {
    const state: any = this._getViewContext();

    this._store.update(key, Object.assign(state, data));
  }

  protected bind (event: string, selector: string, handler: UIEventHandler): void {
    // Create a wrapper event handler to bind on the View
    // hierarchy's root element, but which triggers the
    // provided handler only when the UI Event target
    // matches the selector provided for a child element
    // of this View.
    const targetedHandler: UIEventHandler = (e: UIEvent) => {
      const target: Element = <Element>e.target;

      if (this._root.contains(target) && target.matches(selector)) {
        handler.call(this, e);
      }
    };

    this._eventBindings.push({
      event,
      handler: targetedHandler
    });

    View._appRoot.addEventListener(event, targetedHandler);
  }

  protected find (selector: string): HTMLElement {
    return <HTMLElement>this._root.querySelector(selector);
  }

  protected findAll (selector: string): HTMLElement[] {
    return Array.prototype.slice.call(this._root.querySelectorAll(selector), 0);
  }

  private _attach (target: Element): this {
    this._detach();
    target.appendChild(this._root);
    this.onAttach();

    return this;
  }

  /**
   * Triggers a full View refresh, recursively updating
   * the View's child Views if any.
   */
  private _update (): this {
    const isMounting: boolean = !this._html;

    // View re-render + root replacement. The technique
    // here creates a new wrapper element, renders the
    // updated markup inside it, references the first
    // child element**, and swaps the current root with
    // this element both in the DOM and by reference.
    let newRoot: Element = DOM.create('div');

    newRoot.innerHTML = this._html = this.render(this._getViewContext());

    if (newRoot.children.length === 1) {
      // **Only re-assign the new root to its first child
      // if exactly one exists. If no child elements or
      // multiple child elements exist, preserve the
      // wrapper element to maintain a single root
      // reference.
      newRoot = newRoot.children[0];
    } else {
      // Since we have to preserve the wrapper element,
      // style it to minimally impact inner markup.
      newRoot.setAttribute('style', 'position:relative;width:100%;height:100%;');
    }

    DOM.replace(this._root, newRoot);

    this._root = newRoot;

    // Remaining post-render operations
    this._updateChildViews();

    if (isMounting) {
      this._subscribeToContextUpdates();
      this.onMount();
    }

    this.onUpdate();

    return this;
  }

  /**
   * An atomic operation for refreshing all child Views,
   * both disposing of the existing ones and re-attaching
   * new children contained within the updated View markup.
   */
  private _updateChildViews (): void {
    // Detach and unbind all child Views
    for (const childView of this._childViews) {
      childView._dispose();
    }

    this._childViews.length = 0;

    // Attach new child Views
    const childViewTargets: Element[] = this.findAll('view');

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
    if (!this.context) {
      return;
    }

    this._store.subscribe(this.context, () => this._update());
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

    // TODO: Detach, unbind events, etc.
  }

  private _getViewContext (): T {
    if (!this.context) {
      return null;
    }

    return this._store.getState()[this.context];
  }

  private _isAttached (): boolean {
    return !!this._root.parentElement;
  }
}
