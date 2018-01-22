interface IClassTaxonomy {
  prototype: any;
  name: string;
  parent: string;
}

function getClassTaxonomy (target: any): IClassTaxonomy {
  const prototype: any = Object.getPrototypeOf(target);
  const { name } = target.constructor;
  const { name: parent } = prototype.constructor;

  return {
    prototype,
    name,
    parent
  };
}

export function Implementation (target: any, method: string): void {
  const taxonomy: IClassTaxonomy = getClassTaxonomy(target);

  if (!!taxonomy.prototype[method]) {
    console.warn(`Invalid @Implements: Method '${method}' on class ${taxonomy.name} already exists on base class ${taxonomy.parent}!`);
  }
}

export function Override (target: any, method: string): void {
  const taxonomy: IClassTaxonomy = getClassTaxonomy(target);

  if (!taxonomy.prototype[method]) {
    console.warn(`Invalid @Override: Method '${method}' on class ${taxonomy.name} does not exist on base class ${taxonomy.parent}!`);
  }
}

/**
 * Cues taken from:
 *
 * https://github.com/andreypopp/autobind-decorator
 * https://github.com/NoHomey/bind-decorator
 */
export function Bind (target: any, method: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  return {
    get () {
      const boundMethod = descriptor.value.bind(this);

      Object.defineProperty(this, method, {
        get () {
          return boundMethod;
        }
      });

      return boundMethod;
    }
  };
}
