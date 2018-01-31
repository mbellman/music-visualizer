import ColorField from '@components/Toolkit/ColorField';
import EffectEditor, { IEffectEditorProps } from '@components/Toolkit/EffectEditor';
import NumberField from '@components/Toolkit/NumberField';
import { ActionCreators } from '@state/ActionCreators';
import { Callback, Extension, Override } from '@base';
import { Component, h } from 'preact';
import { Connect } from '@components/Toolkit/Decorators';
import { Dispatch } from 'redux';
import { EffectTypes, IStrokeTemplate } from '@core/Visualization/Types';
import { IAppState } from '@state/Types';
import { Selectors } from '@state/Selectors';

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
  const { color, width } = Selectors.getEffectTemplate(state, StrokeEditor.EFFECT_TYPE, channelIndex) as IStrokeTemplate;

  return {
    color,
    width
  };
}

function mapDispatchToProps (dispatch: Dispatch<IAppState>, { channelIndex }: IStrokeEditorProps): IStrokeEditorPropsFromDispatch {
  const { setEffectTemplateProps } = ActionCreators;

  const updateStroke = ({ ...updatedStroke }: Partial<IStrokeTemplate>) => {
    dispatch(setEffectTemplateProps(StrokeEditor.EFFECT_TYPE, channelIndex, updatedStroke));
  };

  return {
    onChangeColor: (color: string) => {
      updateStroke({ color });
    },
    onChangeWidth: (width: number) => {
      updateStroke({ width });
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
