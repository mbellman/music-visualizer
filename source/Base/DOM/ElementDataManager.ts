import ElementData from 'Base/DOM/ElementData';
import { IHashMap } from 'Base/Types';
import { IRegisteredElement } from 'Base/DOM/Types';

export default class ElementDataManager {
  private static _store: IHashMap<ElementData> = {};

  public static getElementData (element: IRegisteredElement): ElementData {
    const id: string = element.__elementDataId__;

    return this._store[id];
  }

  public static register (element: Element): void {
    if (!ElementDataManager._isRegistered(element)) {
      const id: string = ElementDataManager._generateRandomId();

      (element as IRegisteredElement).__elementDataId__ = id;

      ElementDataManager._store[id] = new ElementData();
    }
  }

  private static _isRegistered (element: Element): boolean {
    const id: string = (element as IRegisteredElement).__elementDataId__;

    return !!ElementDataManager._store[id];
  }

  private static _generateRandomId (): string {
    return (Math.random() * Math.random ()).toString();
  }
}
