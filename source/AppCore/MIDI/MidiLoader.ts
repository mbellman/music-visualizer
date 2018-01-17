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
    const sequence: Sequence = new Sequence(file.name);
    let ticksPerBeat: number;

    for (const chunk of chunkReader.chunks()) {
      switch (chunk.type) {
        case ChunkType.HEADER:
          ticksPerBeat = MidiLoader._parseHeaderChunk(chunk).ticksPerBeat;
          break;
        case ChunkType.TRACK:
          const eventReader: EventReader = new EventReader(chunk.data);
          const channel: Channel = new Channel();
          let runningTicks: number = 0;

          for (const event of eventReader.events()) {
            runningTicks += event.delta;

            switch (event.type) {
              case MetaEventType.TEMPO:
                const stream: Stream = new Stream(event.data);
                const tempo: number = Math.floor(60 / (stream.nextInt24() / 1000000));

                sequence.tempo = tempo;
                break;
              case MidiEventType.NOTE_ON:
                channel.addNote(new Note(event.pitch, 0, runningTicks / ticksPerBeat));
                break;
              case MidiEventType.NOTE_OFF:
                const noteOn: Note = channel.getLastNoteAtPitch(event.pitch);

                if (noteOn) {
                  noteOn.duration = runningTicks / ticksPerBeat - noteOn.delay;
                }
                break;
            }
          }

          if (channel.size > 0) {
            sequence.addChannel(channel);
          }

          break;
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
