import CustomizerManager from '@core/Visualization/CustomizerManager';
import Effect from '@core/Visualization/Effects/Effect';
import Fill from '@core/Visualization/Effects/Fill';
import Glow from '@core/Visualization/Effects/Glow';
import Stroke from '@core/Visualization/Effects/Stroke';
import { EffectTypes, IEffectTemplate, IFillTemplate, IGlowTemplate, IStrokeTemplate } from '@core/Visualization/Types';

export default class EffectFactory extends CustomizerManager {
  private get _delay (): number {
    const { focusDelay } = this.getCustomizerSettings();

    return focusDelay;
  }

  public getEffects (channelIndex: number): Effect[] {
    return [
      EffectTypes.GLOW,
      EffectTypes.FILL,
      EffectTypes.STROKE
    ]
      .map((effectType: EffectTypes) => this.getEffectTemplate(channelIndex, effectType))
      .filter(({ isSelected }: IEffectTemplate) => isSelected)
      .map((effectTemplate: IEffectTemplate) => {
        const effect: Effect = this._getEffect(effectTemplate);

        if (effectTemplate.isDelayed) {
          effect.delay(this._delay);
        }

        return effect;
      });
  }

  private _getEffect (effectTemplate: IEffectTemplate): Effect {
    const { effectType } = effectTemplate;

    switch (effectType) {
      case EffectTypes.GLOW:
        return this._getGlowEffect(effectTemplate as IGlowTemplate);
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

  private _getGlowEffect (glowTemplate: IGlowTemplate): Glow {
    const { color, blur, fadeIn, fadeOut } = glowTemplate;

    return new Glow('#' + color, blur)
      .fadeIn(fadeIn)
      .fadeOut(fadeOut);
  }

  private _getStrokeEffect (strokeTemplate: IStrokeTemplate): Stroke {
    const { color, width } = strokeTemplate;

    return new Stroke('#' + color, width);
  }
}
