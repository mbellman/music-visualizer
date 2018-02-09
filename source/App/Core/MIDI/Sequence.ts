import Channel from '@core/MIDI/Channel';

export default class Sequence {
  public static readonly DEFAULT_TEMPO: number = 120;
  public name: string;
  public tempo: number = Sequence.DEFAULT_TEMPO;
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
