import Note from 'AppCore/MIDI/Note';
import Sequence from 'AppCore/MIDI/Sequence';
import Channel from '@core/MIDI/Channel';

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
   * Returns all notes up to a specified note delay,
   * removing them and shifting the queue forward.
   */
  public take (delay: number): IQueuedNote[] {
    const queuedNotes: IQueuedNote[] = [];

    for (const channelQueue of this._channelQueues) {
      while (channelQueue.length > 0) {
        const { note, channelIndex } = channelQueue[0];

        if (note.delay <= delay) {
          queuedNotes.push(channelQueue.shift());
        } else {
          break;
        }
      }
    }

    return queuedNotes;
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
