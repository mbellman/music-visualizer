import '@styles/Editor.less';

import Channel from '@core/MIDI/Channel';
import Sequence from '@core/MIDI/Sequence';
import { ActionTypes } from '@state/ActionTypes';
import { IPlaylistTrack, ICustomizer, ViewMode } from '@state/Types';
import { h, Component } from 'preact';
import { Override } from 'Base/Core';
import ChannelEditor from '@components/ChannelEditor';
import EditorHeader from '@components/EditorHeader';

interface IEditorProps {
  sequence: Sequence;
}

export default class Editor extends Component<IEditorProps, any> {
  @Override
  public render (): JSX.Element {
    const { sequence } = this.props;

    return (
      <div class="editor">
        <EditorHeader />

        <div class="channel-editors">
          {
            [ ...sequence.channels() ].map((channel: Channel, index: number) => {
              return <ChannelEditor index={ index } />;
            })
          }
        </div>
      </div>
    );
  }
}
