import '@styles/Toolkit/EffectEditor.less';

import { h, Component } from 'preact';
import { Bind, Callback, Override } from '@base';
import SelectableBox from '@components/Toolkit/SelectableBox';
import SelectableButton from '@components/Toolkit/SelectableButton';
import Selectable from '@components/Toolkit/Selectable';
import { Connect } from '@components/Toolkit/Decorators';
import { IAppState } from '@state/Types';
import { EffectTypes } from '@state/VisualizationTypes';
import { Dispatch } from 'redux';
import { ActionCreators } from '@state/ActionCreators';
import { Selectors } from '@state/Selectors';

export interface IEffectEditorPropsFromState {
  isSelected?: boolean;
  isDelayed?: boolean;
}

export interface IEffectEditorPropsFromDispatch {
  onChangeSelected?: Callback<Selectable>;
  onChangeDelayed?: Callback<Selectable>;
}

export interface IEffectEditorProps extends IEffectEditorPropsFromState, IEffectEditorPropsFromDispatch {
  effectType: EffectTypes;
  channelIndex: number;
}

function mapStateToProps (state: IAppState, { channelIndex, effectType }: IEffectEditorProps): IEffectEditorPropsFromState {
  const { isSelected, isDelayed } = Selectors.getEffectTemplate(state, channelIndex, effectType);

  return {
    isSelected,
    isDelayed
  };
}

function mapDispatchToProps (dispatch: Dispatch<IAppState>, { channelIndex, effectType }: IEffectEditorProps): IEffectEditorPropsFromDispatch {
  const { setEffectTemplateProps } = ActionCreators;

  return {
    onChangeSelected: ({ selected }: Selectable) => {
      dispatch(setEffectTemplateProps(channelIndex, effectType, { isSelected: selected }));
    },
    onChangeDelayed: ({ selected }: Selectable) => {
      dispatch(setEffectTemplateProps(channelIndex, effectType, { isDelayed: selected }));
    }
  };
}

@Connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class EffectEditor extends Component<IEffectEditorProps, any> {
  @Override
  public render (): JSX.Element {
    const { isSelected, onChangeSelected, onChangeDelayed, isDelayed } = this.props;

    return (
      <div className={ `effect-editor ${isSelected ? 'selected' : ''}` }>
        <SelectableBox
          onChange={ onChangeSelected }
          selected={ isSelected }
        />

          { this.props.children }

        <SelectableButton
          value="Delay"
          onChange={ onChangeDelayed }
          selected={ isDelayed }
        />
      </div>
    );
  }
}
