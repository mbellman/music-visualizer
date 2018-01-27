import '@styles/Toolkit/EffectEditor.less';

import { h, Component } from 'preact';
import { Bind, Callback, Override } from '@base';
import SelectableBox from '@components/Toolkit/SelectableBox';
import SelectableButton from '@components/Toolkit/SelectableButton';
import Selectable from '@components/Toolkit/Selectable';

export interface IEffectEditorProps {
  isDelayed?: boolean;
  isSelected?: boolean;
  onChangeSelected?: Callback<Selectable>;
  onChangeDelayed?: Callback<Selectable>;
}

export default class EffectEditor extends Component<IEffectEditorProps, any> {
  @Override
  public render (): JSX.Element {
    const { isDelayed, onChangeSelected, onChangeDelayed, isSelected } = this.props;

    return (
      <div class={ `effect-editor ${isSelected ? 'selected' : ''}` }>
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
