import { IChannelEvent, INoteEvent } from '@core/MIDI/Types';

export default class Channel {
  public id: number | string;
  private _channelEvents: IChannelEvent[] = [];

  public constructor (id?: number | string) {
    this.id = id;
  }

  public get size (): number {
    return this._channelEvents.length;
  }

  public addEvent <T extends IChannelEvent>(channelEvent: T): void {
    this._channelEvents.push(channelEvent);
  }

  public getLastNoteAtPitch (pitch: number): INoteEvent {
    for (let i = this._channelEvents.length - 1; i >= 0; i--) {
      const noteEvent: INoteEvent = this._channelEvents[i] as INoteEvent;

      if (noteEvent.pitch === pitch) {
        return noteEvent;
      }
    }
  }

  public * events (): IterableIterator<IChannelEvent> {
    for (const note of this._channelEvents) {
      yield note;
    }
  }
}
