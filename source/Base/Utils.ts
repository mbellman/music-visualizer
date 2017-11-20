export namespace Utils {
  export function bindAll (context: any, ...methods: string[]): void {
    for (const method of methods) {
      if (typeof context[method] === 'function') {
        context[method] = context[method].bind(context);
      }
    }
  }

  export function random (lowest: number, highest: number): number {
    return lowest + Math.floor(Math.random() * (highest - lowest + 1));
  }

  export function clamp (n: number, lowest: number, highest: number): number {
    if ( n >= lowest && n <= highest) {
      return n;
    }

    return n < lowest ? lowest : highest;
  }
}
