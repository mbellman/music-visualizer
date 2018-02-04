import { Utils } from '@base';

export namespace AppUtils {
  export function randomHexColor (): string {
    return (
      Utils.random(16, 255).toString(16) +
      Utils.random(16, 255).toString(16) +
      Utils.random(16, 255).toString(16)
    );
  }
}
