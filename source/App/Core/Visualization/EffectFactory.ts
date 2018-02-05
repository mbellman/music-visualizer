import CustomizerManager from '@core/Visualization/CustomizerManager';
import Effect from '@core/Visualization/Effects/Effect';
import Fill from '@core/Visualization/Effects/Fill';
import Glow from '@core/Visualization/Effects/Glow';
import Note from '@core/MIDI/Note';
import Pool, { IPoolable, IPoolableFactory } from '@core/Pool';
import Stroke from '@core/Visualization/Effects/Stroke';
import Visualizer from '@core/Visualization/Visualizer';
import { EffectTypes, IEffectTemplate, IFillTemplate, IGlowTemplate, IStrokeTemplate } from '@core/Visualization/Types';
import { IHashMap } from 'Base/Types';
import { Implementation } from '@base';

export default class EffectFactory implements IPoolableFactory<Effect> {
  private _effectPools: IHashMap<Pool<Effect>> = {
    [EffectTypes.FILL]: new Pool(Fill, 250),
    [EffectTypes.GLOW]: new Pool(Glow, 250),
    [EffectTypes.STROKE]: new Pool(Stroke, 250)
  };

  @Implementation
  public request (effectTemplate: IEffectTemplate): Effect {
    const { effectType } = effectTemplate;
    const effect: Effect = this._effectPools[effectType].request() as Effect;

    switch (effectType) {
      case EffectTypes.FILL: {
        const { color } = effectTemplate as IFillTemplate;

        return (effect as Fill).construct('#' + color);
      }
      case EffectTypes.GLOW: {
        const { color, blur } = effectTemplate as IGlowTemplate;

        return (effect as Glow).construct('#' + color, blur);
      }
      case EffectTypes.STROKE: {
        const { color, width } = effectTemplate as IStrokeTemplate;

        return (effect as Stroke).construct('#' + color, width);
      }
    }
  }

  @Implementation
  public return (effect: Effect): void {
    const { type } = effect;

    this._effectPools[type].return(effect);
  }
}
