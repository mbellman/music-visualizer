import { Callback } from '@base';

export default class AudioCore {
  private static _context: AudioContext = new AudioContext();

  public static createBufferSource (): AudioBufferSourceNode {
    return AudioCore._context.createBufferSource();
  }

  public static decodeAudioData (audioData: ArrayBuffer, handler: Callback<AudioBuffer>): void {
    AudioCore._context.decodeAudioData(audioData, handler);
  }

  public static play (node: AudioBufferSourceNode, offset?: number, duration?: number): void {
    node.connect(AudioCore._context.destination);
    node.start(0, offset, duration);
  }

  public static stop (node: AudioBufferSourceNode): void {
    node.stop();
    node.disconnect();
  }
}
