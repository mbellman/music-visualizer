import FileLoader from 'AppCore/FileLoader';
import Stream from 'AppCore/MIDI/Stream';

interface IMidiHeader {
  format: number;
  tracks: number;
  ticksPerBeat: number;
}

/**
 * Adapted from:
 *
 * http://www.ccarh.org/courses/253/handout/smf/
 * https://github.com/Tonejs/MidiConvert
 * https://github.com/gasman/jasmid
 */
export default class MidiConverter {
  public static async midiToSequence (file: File): Promise<void> {
    const data: string = await FileLoader.fileToString(file);
    const midiStream: Stream = new Stream(data);
    const header: IMidiHeader = MidiConverter._getHeader(midiStream);

    console.log(header);
  }

  private static _getHeader (midiStream: Stream): IMidiHeader {
    midiStream.reset();
    midiStream.advance(8);

    return {
      format: midiStream.nextInt16(),
      tracks: midiStream.nextInt16(),
      ticksPerBeat: midiStream.nextInt16()
    };
  }
}
