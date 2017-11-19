import { Map } from 'Base/Polyfills';
import { Callback, EventManager } from 'Base/Core';

type UIEventListener = Callback<UIEvent>;

class Query implements IQuery {
  [element: number]: Element;
  private _elements: Element[] = [];
  private _eventListenerMap: Map<UIEventListener, string> = new Map();

  public constructor (selector: string | Element | Query) {
    if (typeof selector === 'string') {
      this._saveSelectedElementsAsKeys(selector);
    } else if (selector instanceof Element) {
      this._saveSingleElement(selector);
    } else if (selector instanceof Query) {
      return selector;
    }
  }

  public html (html: string): this {
    this._forElements((element: Element) => {
      element.innerHTML = html;
    });

    return this;
  }

  public off (event: string = null, listener: UIEventListener = null): this {
    this._off(this._eventToEventArray(event), listener);

    return this;
  }

  public on (event: string, listener: UIEventListener): this {
    this._on(this._eventToEventArray(event), listener);

    return this;
  }

  public remove (): this {
    this._forElements((element: Element) => {
      element.parentElement.removeChild(element);
    });

    return this;
  }

  private _eventToEventArray (event: string = null) {
    return !!event ? event.split(' ') : [null];
  }

  private _forElements (handler: Callback<Element>): void {
    this._elements.forEach((element: Element) => {
      handler(element);
    });
  }

  private _off (events: string[], listener: UIEventListener = null): void {
    events.forEach((event: string) => {
      if (!event || !listener) {
        this._eventListenerMap.forEach((mappedEvent: string, mappedListener: UIEventListener) => {
          if (!event || mappedEvent === event) {
            this.off(mappedEvent, mappedListener);
          }
        });
      } else {
        this._forElements((element: Element) => {
          element.removeEventListener(event, listener);
        });
      }
    });
  }

  private _on (events: string[], listener: UIEventListener): void {
    events.forEach((event: string) => {
      this._eventListenerMap.set(listener, event);

      this._forElements((element: Element) => {
        element.addEventListener(event, listener);
      });
    });
  }

  private _saveSelectedElementsAsKeys (selector: string): void {
    this._elements = Array.prototype.slice.call(document.querySelectorAll(selector), 0);

    this._elements.forEach((element: Element, index: number) => {
      this[index] = element;
    });
  }

  private _saveSingleElement (element: Element): void {
    this[0] = element;
    this._elements = [element];
  }
}

export interface IQuery {
  [element: number]: Element;
  html: (html: string) => this;
  remove: () => this;
  on: (event: string, handler: Callback<UIEvent>) => this;
}

export default function $ (selector: string | Element | Query): IQuery {
  return new Query(selector);
}
