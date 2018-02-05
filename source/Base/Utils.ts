import { Method } from "Base/Types";

export namespace Utils {
  export function bindAll (context: any, ...methods: string[]): void {
    for (const method of methods) {
      if (typeof context[method] === 'function') {
        context[method] = context[method].bind(context);
      }
    }
  }

  export function chance (): boolean {
    return Math.random() < 0.5;
  }

  export function clamp (n: number, lowest: number, highest: number): number {
    if (n >= lowest && n <= highest) {
      return n;
    }

    return n < lowest ? lowest : highest;
  }

  export function clone <T>(object: T): T {
    return JSON.parse(JSON.stringify(object));
  }

  export function modulo (n: number, k: number): number {
    return ((n % k) + k) % k;
  }

  export function pick <T>(array: T[]): T {
    return array[Utils.random(0, array.length - 1)];
  }

  export function random (lowest: number, highest: number): number {
    return lowest + Math.floor(Math.random() * (highest - lowest + 1));
  }

  export function toArray (list: any): any[] {
    return Array.prototype.slice.call(list, 0);
  }

  export function wrap (n: number, lowest: number, highest: number): number {
    if (n > highest) {
      return lowest;
    } else if (n < lowest) {
      return highest;
    } else {
      return n;
    }
  }
}
