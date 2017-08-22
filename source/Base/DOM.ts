export default class DOM {
  public static query (selector: string): NodeListOf<Element> {
    return document.querySelectorAll(selector);
  }

  public static create (tag: string): Element {
    return document.createElement(tag);
  }

  public static replace (target: Element, replacement: Element): void {
    target.parentElement.replaceChild(replacement, target);
  }

  public static remove (target: Element): void {
    target.parentElement.removeChild(target);
  }
}
