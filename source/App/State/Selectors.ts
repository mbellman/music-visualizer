import CustomizerManager from '@core/Visualization/CustomizerManager';
import Visualizer from '@core/Visualization/Visualizer';
import { EffectTypes, IEffectsCustomizer, IEffectTemplate, IShapeTemplate, ICustomizerSettings } from '@core/Visualization/Types';
import { Extension } from '@base';
import { IAppState } from '@state/Types';

export namespace Selectors {
  export function getCustomizerSettings ({ selectedPlaylistTrack}: IAppState): ICustomizerSettings {
    const { settings } = selectedPlaylistTrack.customizer;

    return settings;
  }

  export function getShapeTemplate ({ selectedPlaylistTrack }: IAppState, channelIndex: number): IShapeTemplate {
    const { customizer } = selectedPlaylistTrack;

    return customizer.shapes[channelIndex];
  }

  export function getEffectTemplate ({ selectedPlaylistTrack }: IAppState, effectType: EffectTypes, channelIndex: number): Extension<IEffectTemplate> {
    const { effects } = selectedPlaylistTrack.customizer;
    const effectProp: keyof IEffectsCustomizer = CustomizerManager.EFFECT_TYPE_TO_CUSTOMIZER_PROP[effectType];

    return effects[effectProp][channelIndex];
  }

  export function getEffectTemplates (state: IAppState, channelIndex: number): Extension<IEffectTemplate>[] {
    return Visualizer.EFFECT_TYPES
      .map((effectType: EffectTypes) => Selectors.getEffectTemplate(state, effectType, channelIndex));
  }
}
