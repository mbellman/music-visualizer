import ColorField from '@components/Toolkit/ColorField';
import EffectEditor, { IEffectEditorProps } from '@components/Toolkit/EffectEditor';
import { EffectTypes, IFillTemplate } from '@state/VisualizationTypes';
import { h, Component } from 'preact';
import { Bind, Callback, Override } from '@base';
import { IAppState } from '@state/Types';
import { Selectors } from '@state/Selectors';
import { Dispatch } from 'redux';
import Selectable from '@components/Toolkit/Selectable';
import { connect } from 'preact-redux';
import { ActionCreators } from '@state/ActionCreators';

interface IFillEditorPropsFromState {
  color?: string;
  isSelected?: boolean;
}

interface IFillEditorPropsFromDispatch {
  onChangeColor?: Callback<string>;
  onChangeSelected?: Callback<Selectable>;
  onChangeDelayed?: Callback<Selectable>;
}

interface IFillEditorProps extends IFillEditorPropsFromState, IFillEditorPropsFromDispatch, IEffectEditorProps {
  channelIndex: number;
}

function mapStateToProps (state: IAppState, { channelIndex }: IFillEditorProps): IFillEditorPropsFromState {
  const { color, isSelected } = Selectors.getEffectTemplate(state, channelIndex, EffectTypes.FILL) as IFillTemplate;

  return {
    color,
    isSelected
  };
}

function mapDispatchToProps (dispatch: Dispatch<IAppState>, { channelIndex }: IFillEditorProps): IFillEditorPropsFromDispatch {
  const { setEffectTemplateProps } = ActionCreators;

  return {
    onChangeColor: (color: string) => {
      dispatch(setEffectTemplateProps(channelIndex, EffectTypes.FILL, { color }));
    },
    onChangeSelected: ({ selected }: Selectable) => {
      dispatch(setEffectTemplateProps(channelIndex, EffectTypes.FILL, { isSelected: selected }));
    },
    onChangeDelayed: ({ selected }: Selectable) => {
      dispatch(setEffectTemplateProps(channelIndex, EffectTypes.FILL, { isDelayed: selected }));
    }
  };
}

const FillEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  ({ color, onChangeColor, ...props }: IFillEditorProps): JSX.Element => {
    return (
      <EffectEditor { ...props }>
        <label>Fill:</label>
        <ColorField value={ color } onChange={ onChangeColor } />
      </EffectEditor>
    );
  }
);

export default FillEditor;
