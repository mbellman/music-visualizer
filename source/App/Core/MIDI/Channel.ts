import Note from '@core/MIDI/Note';

export default class Channel {
  public readonly id: number | string;
  private _notes: Note[] = [];

  public constructor (id?: number | string) {
    this.id = id;
  }

  public get size (): number {
    return this._notes.length;
  }

  public addNote (note: Note): void {
    this._notes.push(note);
  }

  public getLastNoteAtPitch (pitch: number): Note {
    for (let i = this._notes.length - 1; i >= 0; i--) {
      const note: Note = this._notes[i];

      if (note.pitch === pitch) {
        return note;
      }
    }
  }

  public * notes (): IterableIterator<Note> {
    for (const note of this._notes) {
      yield note;
    }
  }
}