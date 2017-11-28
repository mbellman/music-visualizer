import ChunkReader from 'AppCore/MIDI/Decoder/ChunkReader';
import EventReader from 'AppCore/MIDI/Decoder/EventReader';
import FileLoader from 'AppCore/FileLoader';
import Sequence from 'AppCore/MIDI/Sequence';
import Stream from 'AppCore/MIDI/Decoder/Stream';
import { ChunkType, IChunk, IHeader, MidiEventType } from 'AppCore/MIDI/Types';

/**
 * Adapted from:
 *
 * http://www.ccarh.org/courses/253/handout/smf/
 * https://github.com/Tonejs/MidiConvert
 * https://github.com/gasman/jasmid
 */
export default class MidiLoader {
  public static async fileToSequence (file: File): Promise<Sequence> {
    const data: string = await FileLoader.fileToString(file);
    const chunkReader: ChunkReader = new ChunkReader(data);
    const sequence: Sequence = new Sequence();

    for (const chunk of chunkReader.chunks()) {
      if (chunk.type === ChunkType.HEADER) {
        // The header chunk will precede all track chunks, so
        // it's safe to assume this condition will trip first.
        const { trackCount } = MidiLoader._parseHeaderChunk(chunk);

        for (let i = 0; i < trackCount; i++) {
          sequence.addChannel();
        }
      } else if (chunk.type === ChunkType.TRACK) {
        const eventReader: EventReader = new EventReader(chunk.data);

        for (const event of eventReader.events()) {
          console.log(event);
        }
      }
    }

    return sequence;
  }

  private static _parseHeaderChunk (chunk: IChunk): IHeader {
    const stream: Stream = new Stream(chunk.data);

    return {
      format: stream.nextInt16(),
      trackCount: stream.nextInt16(),
      ticksPerBeat: stream.nextInt16()
    };
  }
}
