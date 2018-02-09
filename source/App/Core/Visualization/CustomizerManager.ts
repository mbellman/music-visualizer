import Visualizer from '@core/Visualization/Visualizer';
import { EffectTypes, ICustomizer, ICustomizerSettings, IEffectsCustomizer, IEffectTemplate, IShapeTemplate } from '@core/Visualization/Types';
import { Extension, IHashMap } from '@base';

export default class CustomizerManager {
  public static readonly EFFECT_TYPE_TO_CUSTOMIZER_PROP: IHashMap<keyof IEffectsCustomizer> = {
    [EffectTypes.GLOW]: 'glows',
    [EffectTypes.FILL]: 'fills',
    [EffectTypes.STROKE]: 'strokes'
  };

  private _customizer: ICustomizer;

  public constructor (customizer: ICustomizer) {
    this._customizer = customizer;
  }

  public getCustomizerSettings (): ICustomizerSettings {
    return this._customizer.settings;
  }

  public getEffectTemplate (effectType: EffectTypes, channelIndex: number): Extension<IEffectTemplate> {
    const effectProp: keyof IEffectsCustomizer = CustomizerManager.EFFECT_TYPE_TO_CUSTOMIZER_PROP[effectType];

    return this._customizer.effects[effectProp][channelIndex];
  }

  public getShapeTemplate (channelIndex: number): IShapeTemplate {
    return this._customizer.shapes[channelIndex];
  }

  public getTotalChannels (): number {
    return Object.keys(this._customizer.shapes).length;
  }
}
