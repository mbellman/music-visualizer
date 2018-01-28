import ColorField from '@components/Toolkit/ColorField';
import EffectEditor, { IEffectEditorProps } from '@components/Toolkit/EffectEditor';
import { EffectTypes, IFillTemplate } from '@state/VisualizationTypes';
import { h, Component } from 'preact';
import { Callback, Override } from '@base';
import { IAppState } from '@state/Types';
import { Selectors } from '@state/Selectors';
import { Dispatch } from 'redux';
import { ActionCreators } from '@state/ActionCreators';
import { Connect } from '@components/Toolkit/Decorators';

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
  const { color } = Selectors.getEffectTemplate(state, channelIndex, FillEditor.EFFECT_TYPE) as IFillTemplate;

  return { color };
}

function mapDispatchToProps (dispatch: Dispatch<IAppState>, { channelIndex }: IFillEditorProps): IFillEditorPropsFromDispatch {
  const { setEffectTemplateProps } = ActionCreators;

  return {
    onChangeColor: (color: string) => {
      dispatch(setEffectTemplateProps(channelIndex, FillEditor.EFFECT_TYPE, { color }));
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
