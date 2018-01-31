import ColorField from '@components/Toolkit/ColorField';
import EffectEditor, { IEffectEditorProps } from '@components/Toolkit/EffectEditor';
import NumberField from '@components/Toolkit/NumberField';
import { ActionCreators } from '@state/ActionCreators';
import { Callback, Override } from '@base';
import { Component, h } from 'preact';
import { Connect } from '@components/Toolkit/Decorators';
import { Dispatch } from 'redux';
import { EffectTypes, IGlowTemplate } from '@core/Visualization/Types';
import { IAppState } from '@state/Types';
import { Selectors } from '@state/Selectors';

interface IGlowEditorPropsFromState {
  color?: string;
  blur?: number;
}

interface IGlowEditorPropsFromDispatch {
  onChangeColor?: Callback<string>;
  onChangeBlur?: Callback<number>;
}

interface IGlowEditorProps extends IGlowEditorPropsFromState, IGlowEditorPropsFromDispatch {
  channelIndex: number;
}

function mapStateToProps (state: IAppState, { channelIndex }: IGlowEditorProps): IGlowEditorPropsFromState {
  const { color, blur } = Selectors.getEffectTemplate(state, GlowEditor.EFFECT_TYPE, channelIndex) as IGlowTemplate;

  return {
    color,
    blur
  };
}

function mapDispatchToProps (dispatch: Dispatch<IAppState>, { channelIndex }: IGlowEditorProps): IGlowEditorPropsFromDispatch {
  const { setEffectTemplateProps } = ActionCreators;

  const updateGlow = ({ ...updatedGlow }: Partial<IGlowTemplate>) => {
    dispatch(setEffectTemplateProps(GlowEditor.EFFECT_TYPE, channelIndex, updatedGlow));
  };

  return {
    onChangeColor: (color: string) => {
      updateGlow({ color });
    },
    onChangeBlur: (blur: number) => {
      updateGlow({ blur });
    }
  };
}

@Connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class GlowEditor extends Component<IGlowEditorProps, any> {
  public static readonly EFFECT_TYPE: EffectTypes = EffectTypes.GLOW;

  @Override
  public render (): JSX.Element {
    const { color, onChangeColor, blur, onChangeBlur, ref, ...props } = this.props;

    return (
      <EffectEditor effectType={ GlowEditor.EFFECT_TYPE } { ...props }>
        <ColorField label="Glow" value={ color } onChange={ onChangeColor } />
        <NumberField label="Blur" value={ blur } onChange={ onChangeBlur } />
      </EffectEditor>
    );
  }
}
