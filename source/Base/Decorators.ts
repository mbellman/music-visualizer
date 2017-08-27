export function Implementation (target: any, method: string): void {
  const prototype: any = Object.getPrototypeOf(target);

  if (!!prototype[method]) {
    const constructor: string = target.constructor.name;
    const baseConstructor: string = prototype.constructor.name;

    console.warn(`Invalid @Implements: Method '${method}' on class ${constructor} already exists on base class ${baseConstructor}!`);
  }
}

export function Override (target: any, method: string): void {
  const prototype: any = Object.getPrototypeOf(target);

  if (!prototype[method]) {
    const constructor: string = target.constructor.name;
    const baseConstructor: string = prototype.constructor.name;

    console.warn(`Invalid @Override: Method '${method}' on class ${constructor} does not exist on base class ${baseConstructor}!`);
  }
}
