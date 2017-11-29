import Note from 'AppCore/MIDI/Note';

export default class Channel {
  private _notes: Note[] = [];

  public get length (): number {
    return this._notes.length;
  }

  public addNote (note: Note): void {
    this._notes.push(note);
  }

  public getNote (index: number): Note {
    return this._notes[index];
  }

  public * notes (): IterableIterator<Note> {
    for (const note of this._notes) {
      yield note;
    }
  }
}
