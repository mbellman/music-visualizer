import Channel from '@core/MIDI/Channel';
import ChunkReader from '@core/MIDI/Decoder/ChunkReader';
import EventReader from '@core/MIDI/Decoder/EventReader';
import FileLoader from '@core/FileLoader';
import Sequence from '@core/MIDI/Sequence';
import Stream from '@core/MIDI/Decoder/Stream';
import TrackReader from '@core/MIDI/Decoder/TrackReader';
import { ChunkType, IChunk, IHeader, IMidiEvent, IMidiEventData, INoteEvent, ITempoEvent, MetaEventType, MidiEventType } from '@core/MIDI/Types';

/**
 * Adapted from:
 *
 * http://www.ccarh.org/courses/253/handout/smf/
 * https://github.com/Tonejs/MidiConvert
 * https://github.com/gasman/jasmid
 */
export default class MidiLoader {
  public async fileToSequence (file: File): Promise<Sequence> {
    const midiFileData: string = await FileLoader.fileToString(file);
    const chunkReader: ChunkReader = new ChunkReader(midiFileData);
    const sequence: Sequence = new Sequence(file.name);
    let channelIndex: number = 0;
    let ticksPerBeat: number;

    for (const chunk of chunkReader.chunks()) {
      switch (chunk.type) {
        case ChunkType.HEADER:
          ticksPerBeat = this._parseHeaderChunk(chunk.data).ticksPerBeat;

          break;
        case ChunkType.TRACK:
          const trackReader: TrackReader = new TrackReader(chunk.data, ticksPerBeat);
          const channel: Channel = trackReader.getChannel();

          if (channel.size > 0) {
            sequence.addChannel(channel);

            channelIndex++;
          }

          break;
      }
    }

    return sequence;
  }

  private _parseHeaderChunk (chunkData: string): IHeader {
    const stream: Stream = new Stream(chunkData);

    return {
      format: stream.nextInt16(),
      trackCount: stream.nextInt16(),
      ticksPerBeat: stream.nextInt16()
    };
  }
}
