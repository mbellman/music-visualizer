import Sequence from 'AppCore/MIDI/Sequence';
import { Callback, Partial } from 'Base/Core';
import { IAppState, ViewMode } from 'App/State/Types';

export default class Store {
  private static _state: IAppState = {
    currentMusicTrackIndex: 0,
    musicTracks: [],
    viewMode: ViewMode.CUSTOMIZER
  };

  private static _subscribers: Callback<void>[] = [];

  public static getState (): IAppState {
    return { ...Store._state };
  }

  public static setState (updatedState: Partial<IAppState>): void {
    Store._state = { ...Store._state, ...updatedState };

    for (const subscriber of Store._subscribers) {
      subscriber();
    }
  }

  public static subscribe (subscriber: Callback<void>): void {
    Store._subscribers.push(subscriber);
  }
}
