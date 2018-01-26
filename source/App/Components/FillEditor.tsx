import ColorField from '@components/Toolkit/ColorField';
import EffectEditor, { IEffectEditorProps } from '@components/Toolkit/EffectEditor';
import { Effects, IFillTemplate } from 'App/State/VisualizationTypes';
import { h, Component } from 'preact';
import { Bind, Callback, Override } from 'Base/Core';
import { IAppState } from '@state/Types';
import { Selectors } from '@state/Selectors';

interface IFillEditorPropsFromState {
  color?: string;
  selected?: boolean;
}

interface IFillEditorPropsFromDispatch {
  onChangeColor?: Callback<string>;
}

interface IFillEditorProps extends IFillEditorPropsFromState, IFillEditorPropsFromDispatch, IEffectEditorProps {
  channelIndex: number;
}

function mapStateToProps (state: IAppState, { channelIndex }: IFillEditorProps): IFillEditorPropsFromState {
  const fillTemplate: IFillTemplate = Selectors.getEffectTemplate(state, channelIndex, Effects.FILL) as IFillTemplate;

  return {
    color: fillTemplate ? fillTemplate.color : '00f',
    selected: !!fillTemplate
  };
}

export default class FillEditor extends Component<IFillEditorProps, any> {
  @Override
  public render (): JSX.Element {
    const { color, onChangeColor } = this.props;

    return (
      <EffectEditor>
        <label>Fill:</label>
        <ColorField value={ color } onChange={ onChangeColor } />
      </EffectEditor>
    );
  }
}
