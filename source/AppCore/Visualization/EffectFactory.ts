import CustomizerManager from '@core/Visualization/CustomizerManager';
import Effect from '@core/Visualization/Effects/Effect';
import Fill from '@core/Visualization/Effects/Fill';
import Glow from '@core/Visualization/Effects/Glow';
import Note from '@core/MIDI/Note';
import Stroke from '@core/Visualization/Effects/Stroke';
import { EffectTypes, IEffectTemplate, IFillTemplate, IGlowTemplate, IStrokeTemplate, ICustomizer } from '@core/Visualization/Types';

export default class EffectFactory {
  private _customizerManager: CustomizerManager;

  public constructor (customizerManager: CustomizerManager) {
    this._customizerManager = customizerManager;
  }

  private get _focusDelay (): number {
    const { focusDelay } = this._customizerManager.getCustomizerSettings();

    return focusDelay;
  }

  public getEffects (channelIndex: number, note: Note): Effect[] {
    return [
      EffectTypes.GLOW,
      EffectTypes.FILL,
      EffectTypes.STROKE
    ]
      .map((effectType: EffectTypes) => this._customizerManager.getEffectTemplate(effectType, channelIndex))
      .filter(({ isSelected }: IEffectTemplate) => isSelected)
      .map((effectTemplate: IEffectTemplate) => {
        const effect: Effect = this._getEffect(effectTemplate, note);

        if (effectTemplate.isDelayed) {
          effect.delay(this._focusDelay);
        }

        return effect;
      });
  }

  private _getEffect (effectTemplate: IEffectTemplate, note: Note): Effect {
    const { effectType } = effectTemplate;

    switch (effectType) {
      case EffectTypes.GLOW:
        return this._getGlowEffect(effectTemplate as IGlowTemplate, note);
      case EffectTypes.FILL:
        return this._getFillEffect(effectTemplate as IFillTemplate);
      case EffectTypes.STROKE:
        return this._getStrokeEffect(effectTemplate as IStrokeTemplate);
    }
  }

  private _getFillEffect (fillTemplate: IFillTemplate): Fill {
    const { color } = fillTemplate;

    return new Fill('#' + color);
  }

  private _getGlowEffect (glowTemplate: IGlowTemplate, note: Note): Glow {
    const { color, blur, fadeIn } = glowTemplate;
    const { duration } = note;
    const fadeOutTime: number = 1000 * (duration / this._customizerManager.getBeatsPerSecond());

    return new Glow('#' + color, blur)
      .fadeIn(fadeIn)
      .fadeOut(fadeOutTime);
  }

  private _getStrokeEffect (strokeTemplate: IStrokeTemplate): Stroke {
    const { color, width } = strokeTemplate;

    return new Stroke('#' + color, width);
  }
}
