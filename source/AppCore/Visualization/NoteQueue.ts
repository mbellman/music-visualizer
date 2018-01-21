import Note from 'AppCore/MIDI/Note';
import Sequence from 'AppCore/MIDI/Sequence';

export default class NoteQueue {
  private _channels: Note[][] = [];

  public constructor (sequence: Sequence) {
    this._convert(sequence);
  }

  /**
   * Returns all notes up to a specified note delay limit,
   * removing them and shifting the queue forward.
   */
  public take (delay: number): Note[] {
    const notes: Note[] = [];

    for (const channel of this._channels) {
      while (channel.length > 0) {
        const nextNote: Note = channel[0];

        if (nextNote.delay <= delay) {
          notes.push(channel.shift());
        } else {
          break;
        }
      }
    }

    return notes;
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
