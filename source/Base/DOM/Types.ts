import { Callback } from 'Base/Types';

export type UIEventListener = Callback<UIEvent>;

export interface IRegisteredElement extends Element {
  __elementDataId__: string;
}
