import ColorField from '@components/Toolkit/ColorField';
import EffectEditor, { IEffectEditorProps } from '@components/Toolkit/EffectEditor';
import { ActionCreators } from '@state/ActionCreators';
import { Callback, Override } from '@base';
import { Component, h } from 'preact';
import { Connect } from '@components/Toolkit/Decorators';
import { Dispatch } from 'redux';
import { EffectTypes, IFillTemplate } from '@core/Visualization/Types';
import { IAppState } from '@state/Types';
import { Selectors } from '@state/Selectors';

interface IFillEditorPropsFromState {
  color?: string;
}

interface IFillEditorPropsFromDispatch {
  onChangeColor?: Callback<string>;
}

interface IFillEditorProps extends IFillEditorPropsFromState, IFillEditorPropsFromDispatch {
  channelIndex: number;
}

function mapStateToProps (state: IAppState, { channelIndex }: IFillEditorProps): IFillEditorPropsFromState {
  const { color } = Selectors.getEffectTemplate(state, FillEditor.EFFECT_TYPE, channelIndex) as IFillTemplate;

  return { color };
}

function mapDispatchToProps (dispatch: Dispatch<IAppState>, { channelIndex }: IFillEditorProps): IFillEditorPropsFromDispatch {
  const { setEffectTemplateProps } = ActionCreators;

  return {
    onChangeColor: (color: string) => {
      dispatch(setEffectTemplateProps(FillEditor.EFFECT_TYPE, channelIndex, { color }));
    }
  };
}

@Connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class FillEditor extends Component<IFillEditorProps, any> {
  public static readonly EFFECT_TYPE: EffectTypes = EffectTypes.FILL;

  @Override
  public render (): JSX.Element {
    const { color, onChangeColor, ref, ...props } = this.props;

    return (
      <EffectEditor effectType={ FillEditor.EFFECT_TYPE } { ...props }>
        <ColorField label="Fill" value={ color } onChange={ onChangeColor } />
      </EffectEditor>
    );
  }
}
