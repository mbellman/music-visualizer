type DecodeAudioDataHandler = (audioBuffer: AudioBuffer) => void;

export default class AudioCore {
  private static _context: AudioContext = new AudioContext();

  public static decode (audioData: any, handler: DecodeAudioDataHandler): void {
    AudioCore._context.decodeAudioData(audioData, handler);
  }

  public static play (buffer: AudioBuffer): AudioBufferSourceNode {
    const node: AudioBufferSourceNode = AudioCore._context.createBufferSource();

    node.buffer = buffer;

    node.connect(AudioCore._context.destination);
    node.start(AudioCore._context.currentTime);

    return node;
  }

  public static stop (node: AudioBufferSourceNode): void {
    node.stop(this._context.currentTime);
  }
}
