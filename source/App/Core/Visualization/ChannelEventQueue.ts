import Channel from '@core/MIDI/Channel';
import Sequence from '@core/MIDI/Sequence';
import { IChannelEvent } from '@core/MIDI/Types';

type ChannelEventList = IQueuedChannelEvent[];

export interface IQueuedChannelEvent {
  channelEvent: IChannelEvent;
  channelIndex: number;
}

export default class ChannelEventQueue {
  private _channelEventLists: ChannelEventList[] = [];

  public constructor (sequence: Sequence) {
    this._convert(sequence);
  }

  /**
   * Returns the next IQueuedChannelEvent object with a delay before {{delay}}
   * in whichever ChannelEventList happens to contain one meeting this condition.
   * Combined with a while loop, individual IQueuedChannelEvent objects can be
   * retrieved until none exist in the ChannelEventQueue with a delay earlier
   * than {{delay}}. For example:
   *
   *   let queuedChannelEvent: IQueuedChannelEvent;
   *   let delay: number = 50;
   *
   *   while (queuedChannelEvent = channelEventQueue.takeNextUpTo(delay)) {
   *     // ...
   *   }
   */
  public takeNextUpTo (delay: number): IQueuedChannelEvent {
    for (let i = 0; i < this._channelEventLists.length; i++) {
      const channelEventList: ChannelEventList = this._channelEventLists[i];

      if (channelEventList.length > 0) {
        const { channelEvent, channelIndex } = channelEventList[0];

        if (channelEvent.delay <= delay) {
          return channelEventList.shift();
        }
      }
    }

    return null;
  }

  private _convert (sequence: Sequence): void {
    [ ...sequence.channels() ].map((channel: Channel, channelIndex: number) => {
      this._channelEventLists.push([]);

      for (const channelEvent of channel.events()) {
        this._channelEventLists[channelIndex].push({
          channelEvent,
          channelIndex
        });
      }
    });
  }
}
