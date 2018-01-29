import { EffectTypes, ICustomizer, ICustomizerSettings, IEffectsCustomizer, IEffectTemplate, IShapeTemplate } from '@core/Visualization/Types';
import { Extension, IHashMap } from '@base';

export default abstract class CustomizerManager {
  public static readonly EFFECT_TYPE_TO_CUSTOMIZER_PROP: IHashMap<keyof IEffectsCustomizer> = {
    [EffectTypes.FILL]: 'fills',
    [EffectTypes.STROKE]: 'strokes',
    [EffectTypes.GLOW]: 'glows'
  };

  private _customizer: ICustomizer;

  public constructor (customizer: ICustomizer) {
    this._customizer = customizer;
  }

  protected getCustomizerSettings (): ICustomizerSettings {
    return this._customizer.settings;
  }

  protected getEffectTemplate (channelIndex: number, effectType: EffectTypes): Extension<IEffectTemplate> {
    const effectProp: keyof IEffectsCustomizer = CustomizerManager.EFFECT_TYPE_TO_CUSTOMIZER_PROP[effectType];

    return this._customizer.effects[effectProp][channelIndex];
  }

  protected getShapeTemplate (channelIndex: number): IShapeTemplate {
    return this._customizer.shapes[channelIndex];
  }
}
