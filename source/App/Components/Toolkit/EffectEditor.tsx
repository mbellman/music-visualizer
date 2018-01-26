import '@styles/Toolkit/EffectEditor.less';

import { h, Component } from 'preact';
import { Bind, Callback, Override } from '@base';
import SelectableBox from '@components/Toolkit/SelectableBox';
import SelectableButton from '@components/Toolkit/SelectableButton';
import Selectable from '@components/Toolkit/Selectable';

export interface IEffectEditorProps {
  delayed?: boolean;
  selected?: boolean;
  onChangeSelect?: Callback<Selectable>;
  onChangeDelay?: Callback<Selectable>;
}

export default class EffectEditor extends Component<IEffectEditorProps, any> {
  @Override
  public render (): JSX.Element {
    const { delayed, onChangeSelect, onChangeDelay, selected } = this.props;

    return (
      <div class={ `effect-editor ${selected ? 'selected' : ''}` }>
        <SelectableBox
          onChange={ onChangeSelect }
          selected={ selected }
        />

          { this.props.children }

        <SelectableButton
          value="Delay"
          onChange={ onChangeDelay }
          selected={ delayed }
        />
      </div>
    );
  }
}
