import { Utils } from 'Base/Utils';

export default class Note {
  public static readonly MAX_PITCH: number = 127;

  /**
   * Both delay and duration are measured in beats,
   * represented as a rational number.
   */
  public delay: number;
  public duration: number;
  public pitch: number;

  public constructor (pitch?: number, duration?: number, delay?: number) {
    this.pitch = Utils.clamp(pitch, 0, Note.MAX_PITCH);
    this.duration = duration;
    this.delay = delay;
  }
}
