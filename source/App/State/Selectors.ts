import { IAppState, IEffectsCustomizer } from '@state/Types';
import { IShapeTemplate, IEffectTemplate, EffectTypes } from '@state/VisualizationTypes';
import { Extension, IHashMap } from '@base';

export namespace Selectors {
  export const EFFECT_TYPE_TO_CUSTOMIZER_PROP: IHashMap<keyof IEffectsCustomizer> = {
    [EffectTypes.FILL]: 'fills',
    [EffectTypes.STROKE]: 'strokes',
    [EffectTypes.GLOW]: 'glows'
  };

  export function getShapeTemplate ({ selectedPlaylistTrack }: IAppState, channelIndex: number): IShapeTemplate {
    const { customizer } = selectedPlaylistTrack;

    return customizer.shapes[channelIndex];
  }

  export function getEffectTemplate ({ selectedPlaylistTrack }: IAppState, channelIndex: number, effectType: EffectTypes): Extension<IEffectTemplate> {
    const { effects } = selectedPlaylistTrack.customizer;
    const effectProp = Selectors.EFFECT_TYPE_TO_CUSTOMIZER_PROP[effectType];

    return effects[effectProp][channelIndex];
  }

  export function getEffectTemplates (state: IAppState, channelIndex: number): Extension<IEffectTemplate>[] {
    return [
      EffectTypes.FILL,
      EffectTypes.STROKE,
      EffectTypes.GLOW
    ].map((effectType) => getEffectTemplate(state, channelIndex, effectType));
  }
}
