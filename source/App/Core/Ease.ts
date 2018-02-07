export default class Ease {
  public static inQuad (t: number): number {
    return t * t;
  }

  public static outQuad (t: number): number {
    return 1 - Ease.inQuad(t);
  }

  public static inOutQuad (t: number): number {
    return t < 0.5 ? (Ease.inQuad(2 * t) / 2) : (0.5 + Ease.outQuad(2 * t - 1) / 2);
  }
}
