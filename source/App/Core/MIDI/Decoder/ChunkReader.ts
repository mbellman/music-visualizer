import Stream from '@core/MIDI/Decoder/Stream';
import { IChunk } from '@core/MIDI/Types';

export default class ChunkReader {
  private _stream: Stream;

  public constructor (data: string) {
    this._stream = new Stream(data);
  }

  public * chunks (): IterableIterator<IChunk> {
    while (!this._stream.done()) {
      const type: string = this._stream.next(4);
      const size: number = this._stream.nextInt32();
      const data: string = this._stream.next(size);

      yield { type, size, data };
    }
  }
}
