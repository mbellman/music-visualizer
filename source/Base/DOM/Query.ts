import ElementDataManager from 'Base/DOM/ElementDataManager';
import MultiMap from 'Base/Polyfills/MultiMap';
import { Callback, EventManager } from 'Base/Core';
import { UIEventListener, IRegisteredElement } from 'Base/DOM/Types';
import ElementData from 'Base/DOM/ElementData';

export class Query {
  [element: number]: Element;
  private _elements: Element[] = [];

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

  public off (event?: string, listener?: UIEventListener): this {
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

  private _bindEventListener (element: Element, event: string, listener: UIEventListener): void {
    const { eventsMultiMap } = ElementDataManager.getElementData(element as IRegisteredElement);

    eventsMultiMap.put(event, listener);
    element.addEventListener(event, listener);
  }

  private _eventToEventArray (event?: string) {
    return event ? event.split(' ') : [null];
  }

  private _forElements (handler: Callback<Element>): void {
    this._elements.forEach((element: Element) => {
      handler(element);
    });
  }

  private _off (events: string[], listener?: UIEventListener): void {
    this._forElements((element: Element) => {
      const { eventsMultiMap } = ElementDataManager.getElementData(element as IRegisteredElement);

      events.forEach((event: string) => {
        if (!event || !listener) {
          // A null-valued event name indicates that all listeners
          // should be removed, whereas an omitted listener means
          // that all listeners for the event should be removed.
          eventsMultiMap.forEach((mappedListeners: UIEventListener[], mappedEvent: string) => {
            mappedListeners.forEach((mappedListener: UIEventListener) => {
              if (!event || mappedEvent === event) {
                this._unbindEventListener(element, mappedEvent, mappedListener);
              }
            });
          });
        } else {
          this._unbindEventListener(element, event, listener);
        }
      });
    });
  }

  private _on (events: string[], listener: UIEventListener): void {
    this._forElements((element: Element) => {
      events.forEach((event: string) => {
        this._bindEventListener(element, event, listener);
      });
    });
  }

  private _saveSelectedElementsAsKeys (selector: string): void {
    this._elements = Array.prototype.slice.call(document.querySelectorAll(selector), 0);

    this._elements.forEach((element: Element, index: number) => {
      this[index] = element;

      ElementDataManager.register(element);
    });
  }

  private _saveSingleElement (element: Element): void {
    this[0] = element;
    this._elements = [element];

    ElementDataManager.register(element);
  }

  private _unbindEventListener (element: Element, event: string, listener: UIEventListener): void {
    const { eventsMultiMap } = ElementDataManager.getElementData(element as IRegisteredElement);

    eventsMultiMap.remove(event, listener);
    element.removeEventListener(event, listener);
  }
}

export default function $ (selector: string | Element | Query): Query {
  return new Query(selector);
}
