import Selectable from '@components/Toolkit/Selectable';
import SelectableBox from '@components/Toolkit/SelectableBox';
import SelectableButton from '@components/Toolkit/SelectableButton';
import { ActionCreators } from '@state/ActionCreators';
import { Callback, Extension, Override } from '@base';
import { Component, h } from 'preact';
import { Connect } from '@components/Toolkit/Decorators';
import { Dispatch } from 'redux';
import { EffectTypes, IEffectTemplate } from '@core/Visualization/Types';
import { IAppState } from '@state/Types';
import { Selectors } from '@state/Selectors';
import '@styles/Toolkit/EffectEditor.less';

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
  const { isSelected, isDelayed } = Selectors.getEffectTemplate(state, effectType, channelIndex);

  return {
    isSelected,
    isDelayed
  };
}

function mapDispatchToProps (dispatch: Dispatch<IAppState>, { channelIndex, effectType }: IEffectEditorProps): IEffectEditorPropsFromDispatch {
  const { setEffectTemplateProps } = ActionCreators;

  const updateEffect = ({ ...updatedEffect }: Partial<Extension<IEffectTemplate>>) => {
    dispatch(setEffectTemplateProps(effectType, channelIndex, updatedEffect));
  };

  return {
    onChangeSelected: ({ selected }: Selectable) => {
      updateEffect({ isSelected: selected });
    },
    onChangeDelayed: ({ selected }: Selectable) => {
      updateEffect({ isDelayed: selected });
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
      <div className={ `
        effect-editor
        ${isSelected ? ' selected' : ''}
        ${isDelayed ? ' delayed' : ''}
      ` }>
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
