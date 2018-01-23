import { Constructor } from "Base/Types";

type ClassDecorator<T> = (constructor: Constructor<T>) => any;
type MethodDecorator = (target: any, method: string, descriptor: PropertyDescriptor) => any;

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

export function Implementation (target: any, method: string): void {
  const taxonomy: IClassTaxonomy = getClassTaxonomy(target);

  if (!!taxonomy.prototype[method]) {
    console.warn(`Invalid @Implements: Method '${method}' on class ${taxonomy.name} already exists on base class ${taxonomy.parent}!`);
  }
}

export function Mix <T>(...mixins: any[]): ClassDecorator<T> {
  return (constructor: Constructor<T>) => {
    mixins.forEach((mixin: any) => {
      Object.keys(mixin).forEach((key: string) => {
        constructor.prototype[key] = function () {
          try {
            mixin[key].apply(this, arguments);
          } catch (e) {
            console.warn(`Invalid @Mix: Error in mixin '${key}' on target class '${constructor.name}':`);

            throw e;
          }
        };
      });
    });
  };
}

export function Override (target: any, method: string): void {
  const taxonomy: IClassTaxonomy = getClassTaxonomy(target);

  if (!taxonomy.prototype[method]) {
    console.warn(`Invalid @Override: Method '${method}' on class ${taxonomy.name} does not exist on base class ${taxonomy.parent}!`);
  }
}
