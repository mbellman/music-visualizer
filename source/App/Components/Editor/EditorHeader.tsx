import 'App/Styles/EditorHeader.less';
import EditorHeaderField from 'App/Components/Editor/EditorHeaderField';
import Store from 'App/State/Store';
import { ActionTypes } from 'App/State/ActionTypes';
import { ICustomizer, ViewMode } from 'App/State/Types';
import { h, Component } from 'preact';
import { Override } from 'Base/Core';

interface IEditorHeaderFieldBuilder {
  actionType: ActionTypes;
  customizerProp: keyof ICustomizer;
  label: string;
}

interface IEditorHeaderProps {
  playlistTrack: any;
}

export default class EditorHeader extends Component<IEditorHeaderProps, any> {
  @Override
  public render (): JSX.Element {
    const { customizer, sequence } = this.props.playlistTrack;

    return (
      <div class="editor-header">
        <h3 class="sequence-title">{ sequence.name }</h3>

        <EditorHeaderField
          actionType={ ActionTypes.CHANGE_CUSTOMIZER_TEMPO }
          label="Tempo"
          value={ customizer.tempo.toString() }
        />

        <EditorHeaderField
          actionType={ ActionTypes.CHANGE_CUSTOMIZER_SCROLL_SPEED }
          label="Scroll speed"
          value={ customizer.scrollSpeed.toString() }
        />

        <EditorHeaderField
          actionType={ ActionTypes.CHANGE_CUSTOMIZER_SCROLL_SPEED }
          label="Focus delay"
          value={ customizer.focusDelay.toString() }
        />

        <input class="play-button" type="button" onClick={ this._showVisualizer } value="Play" />
      </div>
    );
  }

  private _showVisualizer (): void {
    Store.dispatch({
      type: ActionTypes.CHANGE_VIEW,
      payload: ViewMode.PLAYER
    });
  }
}
