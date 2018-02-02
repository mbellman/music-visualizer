import Channel from '@core/MIDI/Channel';
import Note from '@core/MIDI/Note';
import Sequence from '@core/MIDI/Sequence';

type ChannelQueue = IQueuedNote[];

export interface IQueuedNote {
  note: Note;
  channelIndex: number;
}

export default class NoteQueue {
  private _channelQueues: ChannelQueue[] = [];

  public constructor (sequence: Sequence) {
    this._convert(sequence);
  }

  /**
   * Returns one IQueuedNote object at a time from the first
   * ChannelQueue containing one with a Note object whose
   * delay is earlier than the {{delay}} argument. Combined
   * with a while loop, individual IQueuedNotes can be retrieved
   * until none exist in the NoteQueue with a delay earlier
   * than {{delay}}. For example:
   *
   *   let queuedNote: IQueuedNote;
   *
   *   while (queuedNote = noteQueue.takeNextBefore(N)) {
   *     // ...
   *   }
   */
  public takeNextBefore (delay: number): IQueuedNote {
    for (let i = 0; i < this._channelQueues.length; i++) {
      const channelQueue: ChannelQueue = this._channelQueues[i];

      if (channelQueue.length > 0) {
        const { note, channelIndex } = channelQueue[0];

        if (note.delay <= delay) {
          return channelQueue.shift();
        }
      }
    }

    return null;
  }

  private _convert (sequence: Sequence): void {
    [ ...sequence.channels() ].map((channel: Channel, channelIndex: number) => {
      this._channelQueues.push([]);

      for (const note of channel.notes()) {
        this._channelQueues[channelIndex].push({
          note,
          channelIndex
        });
      }
    });
  }
}
