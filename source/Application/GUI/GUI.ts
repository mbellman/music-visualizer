import { $ } from 'Base/Core';

export default class GUI {
  public set (target: Element): void {
    $(target).html('hello');
  }
}
