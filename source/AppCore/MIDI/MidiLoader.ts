import Channel from 'AppCore/MIDI/Channel';
import ChunkReader from 'AppCore/MIDI/Decoder/ChunkReader';
import EventReader from 'AppCore/MIDI/Decoder/EventReader';
import FileLoader from 'AppCore/FileLoader';
import Note from 'AppCore/MIDI/Note';
import Sequence from 'AppCore/MIDI/Sequence';
import Stream from 'AppCore/MIDI/Decoder/Stream';
import { ChunkType, IChunk, IHeader, MidiEventType, MetaEventType, IMidiEvent } from 'AppCore/MIDI/Types';

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
      if (chunk.type === ChunkType.TRACK) {
        const eventReader: EventReader = new EventReader(chunk.data);
        const channel: Channel = new Channel();
        let runningTime: number = 0;

        for (const event of eventReader.events()) {
          switch (event.type) {
            case MetaEventType.TEMPO:
              // TODO
              break;
            case MidiEventType.NOTE_ON:
              channel.addNote(new Note(event.note, 0, runningTime + event.deltaTime));
              break;
            case MidiEventType.NOTE_OFF:
              channel.getNote(channel.length - 1).duration = event.deltaTime;
              break;
          }

          runningTime += event.deltaTime;
        }

        if (channel.length > 0) {
          sequence.addChannel(channel);
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
