import Note from 'AppCore/MIDI/Note';
import Sequence from 'AppCore/MIDI/Sequence';
import Channel from '@core/MIDI/Channel';

export interface IQueuedNote {
  note: Note;
  channelIndex: number;
}

export default class NoteQueue {
  private _channels: Note[][] = [];

  public constructor (sequence: Sequence) {
    this._convert(sequence);
  }

  /**
   * Returns all notes up to a specified note delay,
   * removing them and shifting the queue forward.
   */
  public take (delay: number): IQueuedNote[] {
    const queuedNotes: IQueuedNote[] = [];

    for (let i = 0; i < this._channels.length; i++) {
      const channel: Note[] = this._channels[i];

      while (channel.length > 0) {
        const nextNote: Note = channel[0];

        if (nextNote.delay <= delay) {
          queuedNotes.push({
            note: channel.shift(),
            channelIndex: i
          });
        } else {
          break;
        }
      }
    }

    return queuedNotes;
  }

  private _convert (sequence: Sequence): void {
    for (const channel of sequence.channels()) {
      const c: number = this._channels.length;

      this._channels.push([]);

      for (const note of channel.notes()) {
        this._channels[c].push(note);
      }
    }
  }
}
