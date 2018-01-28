import ColorField from '@components/Toolkit/ColorField';
import NumberField from '@components/Toolkit/NumberField';
import EffectEditor, { IEffectEditorProps } from '@components/Toolkit/EffectEditor';
import { EffectTypes, IStrokeTemplate } from '@state/VisualizationTypes';
import { h, Component } from 'preact';
import { Callback, Override } from '@base';
import { IAppState } from '@state/Types';
import { Selectors } from '@state/Selectors';
import { Dispatch } from 'redux';
import { ActionCreators } from '@state/ActionCreators';
import { Connect } from '@components/Toolkit/Decorators';

interface IStrokeEditorPropsFromState {
  color?: string;
  width?: number;
}

interface IStrokeEditorPropsFromDispatch {
  onChangeColor?: Callback<string>;
  onChangeWidth?: Callback<number>;
}

interface IStrokeEditorProps extends IStrokeEditorPropsFromState, IStrokeEditorPropsFromDispatch {
  channelIndex: number;
}

function mapStateToProps (state: IAppState, { channelIndex }: IStrokeEditorProps): IStrokeEditorPropsFromState {
  const { color, width } = Selectors.getEffectTemplate(state, channelIndex, StrokeEditor.EFFECT_TYPE) as IStrokeTemplate;

  return {
    color,
    width
  };
}

function mapDispatchToProps (dispatch: Dispatch<IAppState>, { channelIndex }: IStrokeEditorProps): IStrokeEditorPropsFromDispatch {
  const { setEffectTemplateProps } = ActionCreators;

  return {
    onChangeColor: (color: string) => {
      dispatch(setEffectTemplateProps(channelIndex, StrokeEditor.EFFECT_TYPE, { color }));
    },
    onChangeWidth: (width: number) => {
      dispatch(setEffectTemplateProps(channelIndex, StrokeEditor.EFFECT_TYPE, { width }));
    }
  };
}

@Connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class StrokeEditor extends Component<IStrokeEditorProps, any> {
  public static readonly EFFECT_TYPE: EffectTypes = EffectTypes.STROKE;

  @Override
  public render (): JSX.Element {
    const { color, onChangeColor, width, onChangeWidth, ref, ...props } = this.props;

    return (
      <EffectEditor effectType={ StrokeEditor.EFFECT_TYPE } { ...props }>
        <ColorField label="Stroke" value={ color } onChange={ onChangeColor } />
        <NumberField label="Width" value={ width } size={ 2 } onChange={ onChangeWidth } />
      </EffectEditor>
    );
  }
}
