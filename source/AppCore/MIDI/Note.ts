export default class Note {
  public delay: number;
  public duration: number;
  public pitch: number;

  public constructor (pitch?: number, duration?: number, delay?: number) {
    this.pitch = pitch;
    this.duration = duration;
    this.delay = delay;
  }
}
