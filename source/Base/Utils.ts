export namespace Utils {
  export function bindAll (context: any, ...methods: string[]): void {
    for (const method of methods) {
      if (typeof context[method] === 'function') {
        context[method] = context[method].bind(context);
      }
    }
  }
}
