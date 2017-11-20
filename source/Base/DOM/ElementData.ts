import MultiMap from 'Base/Polyfills/MultiMap';
import { UIEventListener } from 'Base/DOM/Types';

export default class ElementData {
  public eventsMultiMap: MultiMap<string, UIEventListener> = new MultiMap();
}
