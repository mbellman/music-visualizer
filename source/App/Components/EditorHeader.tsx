import '@styles/EditorHeader.less';

import CustomizerSettingField from '@components/CustomizerSettingField';
import { ActionTypes, IAction } from '@state/ActionTypes';
import { ICustomizer, ViewMode, IAppState } from '@state/Types';
import { h, Component } from 'preact';
import { Bind, Override } from 'Base/Core';
import { Connect } from '@components/Toolkit/Decorators';
import { ActionCreators } from '@state/ActionCreators';
import { Dispatch, bindActionCreators, ActionCreator } from 'redux';
import Sequence from '@core/MIDI/Sequence';

interface IEditorHeaderProps {
  sequence?: Sequence;
  changeView?: ActionCreator<IAction>;
}

function mapStateToProps (state: IAppState): Partial<IEditorHeaderProps> {
  const { sequence } = state.selectedPlaylistTrack;

  return { sequence };
}

function mapDispatchToProps (dispatch: Dispatch<IAppState>): Partial<IEditorHeaderProps> {
  const { changeView } = ActionCreators;

  return bindActionCreators({
    changeView
  }, dispatch);
}

@Connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class EditorHeader extends Component<IEditorHeaderProps, any> {
  @Override
  public render (): JSX.Element {
    const { sequence } = this.props;

    return (
      <div class="editor-header">
        <h3 class="sequence-title">{ sequence.name }</h3>

        <CustomizerSettingField setting="tempo" label="Tempo" />
        <CustomizerSettingField setting="focusDelay" label="Focus Delay" />
        <CustomizerSettingField setting="scrollSpeed" label="Scroll speed" />

        <input class="play-button" type="button" onClick={ this._showVisualizer } value="Play" />
      </div>
    );
  }

  @Bind
  private _showVisualizer (): void {
    this.props.changeView(ViewMode.PLAYER);
  }
}
