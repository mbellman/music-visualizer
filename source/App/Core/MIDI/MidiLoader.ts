import Channel from '@core/MIDI/Channel';
import ChunkReader from '@core/MIDI/Decoder/ChunkReader';
import EventReader from '@core/MIDI/Decoder/EventReader';
import FileLoader from '@core/FileLoader';
import Note from '@core/MIDI/Note';
import Sequence from '@core/MIDI/Sequence';
import Stream from '@core/MIDI/Decoder/Stream';
import { ChunkType, IChunk, IHeader, MetaEventType, MidiEventType } from '@core/MIDI/Types';

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
    let channelIndex: number = 0;

    for (const chunk of chunkReader.chunks()) {
      switch (chunk.type) {
        case ChunkType.HEADER:
          ticksPerBeat = MidiLoader._parseHeaderChunk(chunk).ticksPerBeat;

          break;
        case ChunkType.TRACK:
          const eventReader: EventReader = new EventReader(chunk.data);
          const channel: Channel = new Channel(channelIndex);
          let currentBeat: number = 0;

          for (const event of eventReader.events()) {
            currentBeat += (event.delta / ticksPerBeat);

            switch (event.type) {
              case MetaEventType.TEMPO:
                const stream: Stream = new Stream(event.data);
                const tempo: number = Math.floor(60 / (stream.nextInt24() / 1000000));

                sequence.tempo = tempo;
                break;
              case MidiEventType.NOTE_ON:
                channel.addNote(new Note(event.pitch, 0, currentBeat));
                break;
              case MidiEventType.NOTE_OFF:
                const noteOn: Note = channel.getLastNoteAtPitch(event.pitch);

                if (noteOn) {
                  noteOn.duration = currentBeat - noteOn.delay;
                }
                break;
            }
          }

          if (channel.size > 0) {
            sequence.addChannel(channel);

            channelIndex++;
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
