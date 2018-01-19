import Channel from 'AppCore/MIDI/Channel';
import ChannelOptions from 'App/State/ChannelOptions';
import Sequence from 'AppCore/MIDI/Sequence';
import Shape from 'AppCore/Visualization/Shapes/Shape';
import { IConstructor, Map } from 'Base/Core';

export default class SequenceOptions {
  private _channelOptionsMap: Map<Channel, ChannelOptions> = new Map();

  public constructor (sequence: Sequence) {
    for (const channel of sequence.channels()) {
      this._channelOptionsMap.set(channel, new ChannelOptions());
    }
  }

  public getChannelOptions (channel: Channel): ChannelOptions {
    return this._channelOptionsMap.entries().filter(([ storedChannel, channelOptions ]) => {
      return storedChannel === channel;
    }).pop()[1];
  }
}
