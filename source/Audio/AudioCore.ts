export default class AudioCore {
  private static _context: AudioContext;

  public static initialize (): void {
    AudioCore._context = new AudioContext();
  }
}
