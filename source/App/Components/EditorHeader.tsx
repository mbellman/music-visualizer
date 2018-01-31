import AudioFile from 'Audio/AudioFile';
import CustomizerSettingField from '@components/CustomizerSettingField';
import Sequence from '@core/MIDI/Sequence';
import { ActionCreator, bindActionCreators, Dispatch } from 'redux';
import { ActionCreators } from '@state/ActionCreators';
import { Bind, Method, Override } from 'Base/Core';
import { Component, h } from 'preact';
import { Connect } from '@components/Toolkit/Decorators';
import { IAction } from '@state/ActionTypes';
import { IAppState, ViewMode } from '@state/Types';
import '@styles/EditorHeader.less';

interface IEditorHeaderPropsFromState {
  audioFile?: AudioFile;
  sequence?: Sequence;
}

interface IEditorHeaderPropsFromDispatch {
  changeView?: Method<ViewMode>;
}

interface IEditorHeaderProps extends IEditorHeaderPropsFromState, IEditorHeaderPropsFromDispatch {}

function mapStateToProps (state: IAppState): IEditorHeaderPropsFromState {
  const { audioFile, sequence } = state.selectedPlaylistTrack;

  return {
    audioFile,
    sequence
  };
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
    const { audioFile, sequence } = this.props;

    return (
      <div className="editor-header">
        <div className="editor-header-title">
          <div>{ sequence.name }</div>
          <div>
            <label>{ audioFile ? audioFile.name : 'No audio file selected.' }</label>
          </div>
        </div>

        <div class="editor-header-fields">
          <CustomizerSettingField label="Tempo" setting="tempo" />
          <CustomizerSettingField label="Scroll speed" setting="scrollSpeed" />
          <CustomizerSettingField label="Focus delay" setting="focusDelay" />
          <CustomizerSettingField label="Audio delay" setting="audioDelay" />
        </div>

        <input className="play-button" type="button" onClick={ this._showVisualizer } value="Play" />
      </div>
    );
  }

  @Bind
  private _showVisualizer (): void {
    this.props.changeView(ViewMode.PLAYER);
  }
}
