import CustomizerManager from '@core/Visualization/CustomizerManager';
import { EffectTypes, IEffectsCustomizer, IEffectTemplate, IShapeTemplate } from '@core/Visualization/Types';
import { Extension, IHashMap } from '@base';
import { IAppState } from '@state/Types';

export namespace Selectors {
  export function getShapeTemplate ({ selectedPlaylistTrack }: IAppState, channelIndex: number): IShapeTemplate {
    const { customizer } = selectedPlaylistTrack;

    return customizer.shapes[channelIndex];
  }

  export function getEffectTemplate ({ selectedPlaylistTrack }: IAppState, channelIndex: number, effectType: EffectTypes): Extension<IEffectTemplate> {
    const { effects } = selectedPlaylistTrack.customizer;
    const effectProp: keyof IEffectsCustomizer = CustomizerManager.EFFECT_TYPE_TO_CUSTOMIZER_PROP[effectType];

    return effects[effectProp][channelIndex];
  }

  export function getEffectTemplates (state: IAppState, channelIndex: number): Extension<IEffectTemplate>[] {
    return [
      EffectTypes.GLOW,
      EffectTypes.FILL,
      EffectTypes.STROKE
    ]
      .map((effectType: EffectTypes) => Selectors.getEffectTemplate(state, channelIndex, effectType));
  }
}
