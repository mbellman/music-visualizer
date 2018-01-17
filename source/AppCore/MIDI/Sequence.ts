import Channel from 'AppCore/MIDI/Channel';
import Note from 'AppCore/MIDI/Note';

export default class Sequence {
  public name: string;
  public tempo: number = 130;
  private _channels: Channel[] = [];

  public addChannel (channel: Channel): void {
    this._channels.push(channel);
  }

  public * channels (): IterableIterator<Channel> {
    for (const channel of this._channels) {
      yield channel;
    }
  }
}
