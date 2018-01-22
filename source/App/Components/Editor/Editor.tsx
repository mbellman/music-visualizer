import 'App/Styles/Editor.less';
import Channel from 'AppCore/MIDI/Channel';
import ChannelEditor from 'App/Components/Editor/ChannelEditor';
import EditorHeader from 'App/Components/Editor/EditorHeader';
import Sequence from 'AppCore/MIDI/Sequence';
import Store from 'App/State/Store';
import { ActionTypes } from 'App/State/ActionTypes';
import { IPlaylistTrack, ICustomizer, ViewMode } from 'App/State/Types';
import { h, Component } from 'preact';
import { Override, Partial, Utils } from 'Base/Core';

interface IEditorProps {
  playlistTrack: IPlaylistTrack;
}

export default class Editor extends Component<IEditorProps, any> {
  @Override
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
