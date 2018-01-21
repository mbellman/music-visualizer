import 'App/Styles/Editor.less';
import Channel from 'AppCore/MIDI/Channel';
import ChannelEditor from 'App/Components/ChannelEditor';
import EditorHeader from 'App/Components/EditorHeader';
import Sequence from 'AppCore/MIDI/Sequence';
import Store from 'App/State/Store';
import { ActionTypes } from 'App/State/ActionTypes';
import { IPlaylistTrack, ICustomizer, ViewMode } from 'App/State/Types';
import { h, Component } from 'preact';
import { Utils, Partial } from 'Base/Core';

interface IPlayerOptionFieldBuilder {
  actionType: ActionTypes;
  customizerProp: keyof ICustomizer;
  label: string;
}

interface IEditorProps {
  playlistTrack: IPlaylistTrack;
}

export default class Editor extends Component<IEditorProps, any> {
  private _customizerOptionBuilders: IPlayerOptionFieldBuilder[] = [
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
      <div class="editor">
        <EditorHeader playlistTrack={ this.props.playlistTrack } />

        <div class="channel-editors">
          {
            [ ...sequence.channels() ].map((channel: Channel, index: number) => {
              return (
                <ChannelEditor
                  channel={ channel }
                  channelCustomizer={ customizer.channels[index] }
                />
              );
            })
          }
        </div>
      </div>
    );
  }
}
