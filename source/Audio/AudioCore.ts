import { Callback } from '@base';

export default class AudioCore {
  private static _context: AudioContext = new AudioContext();

  public static decodeAudioData (audioData: ArrayBuffer, handler: Callback<AudioBuffer>): void {
    AudioCore._context.decodeAudioData(audioData, handler);
  }

  public static createBufferSource (): AudioBufferSourceNode {
    return AudioCore._context.createBufferSource();
  }

  public static play (node: AudioBufferSourceNode): void {
    node.connect(AudioCore._context.destination);
    node.start(AudioCore._context.currentTime);
  }

  public static stop (node: AudioBufferSourceNode): void {
    node.stop();
  }
}
