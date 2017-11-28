/**
 * Adapted from:
 *
 * https://github.com/gasman/jasmid/blob/master/stream.js
 */
export default class Stream {
  private _string: string;
  private _position: number = 0;

  public constructor (string: string) {
    this._string = string;
  }

  public advance (length: number): void {
    this._position += length;
  }

  public next (length: number): string {
    const chunk: string = this._string.substr(this._position, length);

    this.advance(length);

    return chunk;
  }

  public nextInt8 (): number {
    const int8: number = this._string.charCodeAt(this._position);

    this.advance(1);

    return int8;
  }

  public nextInt16 (): number {
    return (this.nextInt8() << 8) + this.nextInt8();
  }

  public nextInt32 (): number {
    return (
      (this.nextInt8() << 24) +
      (this.nextInt8() << 16) +
      (this.nextInt8() << 8) +
      this.nextInt8()
    );
  }

  /**
   * http://www.codecodex.com/wiki/Variable-Length_Integers
   */
  public nextVarInt (): number {
    let varInt: number = 0;

    while (true) {
      const int8: number = this.nextInt8();

      if (int8 & 128) {
        varInt += int8 & 127;
        varInt <<= 7;
      } else {
        return varInt + int8;
      }
    }
  }

  public reset (): void {
    this._position = 0;
  }
}
