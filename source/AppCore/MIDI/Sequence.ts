import Channel from 'AppCore/MIDI/Channel';
import Note from 'AppCore/MIDI/Note';

export default class Sequence {
  public readonly name: string;
  public tempo: number = 130;
  private _channels: Channel[] = [];

  public constructor (name?: string) {
    this.name = name;
  }

  public addChannel (channel: Channel): void {
    this._channels.push(channel);
  }

  public getChannel (index: number): Channel {
    return this._channels[index];
  }

  public * channels (): IterableIterator<Channel> {
    for (const channel of this._channels) {
      yield channel;
    }
  }
}
