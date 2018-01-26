import { IAppState } from '@state/Types';
import { IShapeTemplate, IEffectTemplate, Effects } from '@state/VisualizationTypes';

export namespace Selectors {
  export function getShapeTemplate ({ selectedPlaylistTrack }: IAppState, channelIndex: number): IShapeTemplate {
    const { customizer } = selectedPlaylistTrack;

    return customizer.shapeTemplates[channelIndex];
  }

  export function getEffectTemplates ({ selectedPlaylistTrack }: IAppState, channelIndex: number): IEffectTemplate[] {
    const { customizer } = selectedPlaylistTrack;

    return customizer.effectTemplates[channelIndex];
  }

  export function getEffectTemplate (state: IAppState, channelIndex: number, effect: Effects): IEffectTemplate {
    const effectTemplates = Selectors.getEffectTemplates(state, channelIndex);

    return effectTemplates.filter(({ type }) => type === effect)[0];
  }
}
