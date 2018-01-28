import Channel from '@core/MIDI/Channel';
import ChannelEditor from '@components/ChannelEditor';
import EditorHeader from '@components/EditorHeader';
import Sequence from '@core/MIDI/Sequence';
import { ActionTypes } from '@state/ActionTypes';
import { Component, h } from 'preact';
import { ICustomizer, IPlaylistTrack, ViewMode } from '@state/Types';
import { Override } from 'Base/Core';
import '@styles/Editor.less';

interface IEditorProps {
  sequence: Sequence;
}

export default class Editor extends Component<IEditorProps, any> {
  @Override
  public render (): JSX.Element {
    const { sequence } = this.props;

    return (
      <div className="editor">
        <EditorHeader />

        <div className="channel-editors">
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
