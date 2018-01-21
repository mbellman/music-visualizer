import 'App/Styles/EditorHeader.less';
import EditorHeaderField from 'App/Components/Editor/EditorHeaderField';
import Store from 'App/State/Store';
import { ActionTypes } from 'App/State/ActionTypes';
import { ICustomizer, ViewMode } from 'App/State/Types';
import { h, Component } from 'preact';

interface IEditorHeaderFieldBuilder {
  actionType: ActionTypes;
  customizerProp: keyof ICustomizer;
  label: string;
}

interface IEditorHeaderProps {
  playlistTrack: any;
}

export default class EditorHeader extends Component<IEditorHeaderProps, any> {
  private _editorHeaderFieldBuilders: IEditorHeaderFieldBuilder[] = [
    {
      actionType: ActionTypes.CHANGE_CUSTOMIZER_TEMPO,
      customizerProp: 'tempo',
      label: 'Tempo'
    },
    {
      actionType: ActionTypes.CHANGE_CUSTOMIZER_SCROLL_SPEED,
      customizerProp: 'scrollSpeed',
      label: 'Scroll speed'
    },
    {
      actionType: ActionTypes.CHANGE_CUSTOMIZER_FOCUS_DELAY,
      customizerProp: 'focusDelay',
      label: 'Focus delay'
    }
  ];

  public render (): JSX.Element {
    const { customizer, sequence } = this.props.playlistTrack;

    return (
      <div class="editor-header">
        <h3 class="sequence-title">{ sequence.name }</h3>

        {
          this._editorHeaderFieldBuilders.map((builder: IEditorHeaderFieldBuilder) => {
            const { actionType, label, customizerProp } = builder;

            return (
              <EditorHeaderField
                actionType={ actionType }
                label={ label }
                value={ customizer[customizerProp].toString() }
              />
            );
          })
        }

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
