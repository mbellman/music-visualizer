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

interface IEditorHeaderPropsFromState {
  sequence?: Sequence;
}

interface IEditorHeaderPropsFromDispatch {
  changeView?: ActionCreator<IAction>;
}

interface IEditorHeaderProps extends IEditorHeaderPropsFromState, IEditorHeaderPropsFromDispatch {}

function mapStateToProps (state: IAppState): IEditorHeaderPropsFromState {
  const { sequence } = state.selectedPlaylistTrack;

  return { sequence };
}

function mapDispatchToProps (dispatch: Dispatch<IAppState>): IEditorHeaderPropsFromDispatch {
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
      <div className="editor-header">
        <h3 className="sequence-title">{ sequence.name }</h3>

        <CustomizerSettingField label="Tempo" setting="tempo" />
        <CustomizerSettingField label="Focus Delay" setting="focusDelay" />
        <CustomizerSettingField label="Scroll speed" setting="scrollSpeed" />

        <input className="play-button" type="button" onClick={ this._showVisualizer } value="Play" />
      </div>
    );
  }

  @Bind
  private _showVisualizer (): void {
    this.props.changeView(ViewMode.PLAYER);
  }
}