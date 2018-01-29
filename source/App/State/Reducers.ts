import Channel from '@core/MIDI/Channel';
import Sequence from '@core/MIDI/Sequence';
import { ActionTypes, IAction, ICustomizerSettingsAction, IEffectAction, IShapeAction } from '@state/ActionTypes';
import { EffectTypes, ICustomizer, ICustomizerSettings, IEffectsCustomizer, IEffectTemplate, IShapeTemplate } from '@core/Visualization/Types';
import { Extension, Utils } from '@base';
import { IAppState, IPlaylistTrack, ViewMode } from '@state/Types';
import { initialCustomizerState, initialFillTemplate, initialGlowTemplate, initialShapeTemplate, initialState, initialStrokeTemplate } from '@state/Initializers';
import { Selectors } from '@state/Selectors';
import CustomizerManager from '@core/Visualization/CustomizerManager';

function changeCustomizerProp <K extends keyof ICustomizer>(state: IAppState, prop: K, value: ICustomizer[K]): IAppState {
  const { customizer } = state.selectedPlaylistTrack;

  return changeSelectedPlaylistTrackProp(state, 'customizer', {
    ...customizer,
    [prop]: value
  });
}

function changeSelectedPlaylistTrackProp <K extends keyof IPlaylistTrack>(state: IAppState, prop: K, value: IPlaylistTrack[K]): IAppState {
  return {
    ...state,
    selectedPlaylistTrack: {
      ...state.selectedPlaylistTrack,
      [prop]: value
    }
  };
}

function changeSequence (state: IAppState, sequence: Sequence): IAppState {
  const { tempo } = sequence;
  const customizer: ICustomizer = Utils.clone(initialCustomizerState);

  [ ...sequence.channels() ].forEach((channel: Channel, index: number) => {
    customizer.shapes[index] = initialShapeTemplate;
    customizer.effects.glows[index] = initialGlowTemplate;
    customizer.effects.fills[index] = initialFillTemplate;
    customizer.effects.strokes[index] = initialStrokeTemplate;
  });

  state = changeSelectedPlaylistTrackProp(state, 'sequence', sequence);
  state = changeSelectedPlaylistTrackProp(state, 'customizer', customizer);
  state = setCustomizerSettings(state, { tempo });

  return state;
}

function jumpToPlaylistTrack (state: IAppState, index: number): IAppState {
  state = syncSelectedPlaylistTrack(state);
  index = Utils.wrap(index, 0, state.playlist.length - 1);

  const { audioFile, customizer, sequence } = state.playlist[index];

  return {
    ...state,
    selectedPlaylistTrack: {
      audioFile,
      customizer,
      index,
      sequence
    }
  };
}

function setCustomizerSettings (state: IAppState, updatedSettings: Partial<ICustomizerSettings>): IAppState {
  const { settings } = state.selectedPlaylistTrack.customizer;

  return changeCustomizerProp(state, 'settings', {
    ...settings,
    ...updatedSettings
  });
}

function setEffectTemplateProps (state: IAppState, channelIndex: number, effectType: EffectTypes, props: Partial<Extension<IEffectTemplate>>): IAppState {
  const { effects } = state.selectedPlaylistTrack.customizer;
  const effectProp: keyof IEffectsCustomizer = CustomizerManager.EFFECT_TYPE_TO_CUSTOMIZER_PROP[effectType];
  const effectTemplate: IEffectTemplate = effects[effectProp][channelIndex];

  return changeCustomizerProp(state, 'effects', {
    ...effects,
    [effectProp]: {
      ...effects[effectProp],
      [channelIndex]: {
        ...effectTemplate,
        ...props
      }
    }
  });
}

function setShapeTemplateProps (state: IAppState, channelIndex: number, props: Partial<IShapeTemplate>): IAppState {
  const { shapes } = state.selectedPlaylistTrack.customizer;
  const shapeTemplate: IShapeTemplate = shapes[channelIndex];

  return changeCustomizerProp(state, 'shapes', {
    ...shapes,
    [channelIndex]: {
      ...shapeTemplate,
      ...props
    }
  });
}

function syncSelectedPlaylistTrack (state: IAppState): IAppState {
  const { audioFile, customizer, index, sequence } = state.selectedPlaylistTrack;

  return {
    ...state,
    playlist: [
      ...state.playlist.slice(0, index),
      {
        audioFile,
        customizer,
        sequence
      },
      ...state.playlist.slice(index + 1)
    ]
  };
}

export function appReducer (state: IAppState = initialState, action: IAction): IAppState {
  switch (action.type) {
    case ActionTypes.CHANGE_AUDIO_FILE: {
      return changeSelectedPlaylistTrackProp(state, 'audioFile', action.payload);
    }
    case ActionTypes.CHANGE_SEQUENCE: {
      return changeSequence(state, action.payload);
    }
    case ActionTypes.CHANGE_VIEW: {
      return {
        ...state,
        viewMode: action.payload
      };
    }
    case ActionTypes.JUMP_TO_PLAYLIST_TRACK: {
      return jumpToPlaylistTrack(state, action.payload);
    }
    case ActionTypes.NEXT_PLAYLIST_TRACK: {
      return jumpToPlaylistTrack(state, state.selectedPlaylistTrack.index + 1);
    }
    case ActionTypes.PREVIOUS_PLAYLIST_TRACK: {
      return jumpToPlaylistTrack(state, state.selectedPlaylistTrack.index - 1);
    }
    case ActionTypes.RESET_CUSTOMIZER: {
      return changeSelectedPlaylistTrackProp(state, 'customizer', initialCustomizerState);
    }
    case ActionTypes.SET_CUSTOMIZER_SETTINGS: {
      const { type, ...settings } = action as ICustomizerSettingsAction;

      return setCustomizerSettings(state, settings);
    }
    case ActionTypes.SET_EFFECT_TEMPLATE_PROPS: {
      const { index, type, effectType, ...props } = action as IEffectAction;

      return setEffectTemplateProps(state, index, effectType, props);
    }
    case ActionTypes.SET_SHAPE_TEMPLATE_PROPS: {
      const { index, type, ...props } = action as IShapeAction;

      return setShapeTemplateProps(state, index, props);
    }
    case ActionTypes.SYNC_SELECTED_PLAYLIST_TRACK: {
      return syncSelectedPlaylistTrack(state);
    }
    default: {
      return state;
    }
  }
}
