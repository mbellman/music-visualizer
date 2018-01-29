import Channel from '@core/MIDI/Channel';
import FillEditor from '@components/FillEditor';
import NotePreview from '@components/NotePreview';
import ShapeEditor from '@components/ShapeEditor';
import StrokeEditor from '@components/StrokeEditor';
import { Component, h } from 'preact';
import { Connect } from '@components/Toolkit/Decorators';
import { IAppState } from '@state/Types';
import { Override } from '@base';
import '@styles/ChannelEditor.less';

interface IChannelEditorPropsFromState {
  channel?: Channel;
}

interface IChannelEditorProps extends IChannelEditorPropsFromState {
  index: number;
}

function mapStateToProps ({ selectedPlaylistTrack }: IAppState, { index }: IChannelEditorProps): IChannelEditorPropsFromState {
  const { sequence } = selectedPlaylistTrack;

  return {
    channel: sequence.getChannel(index)
  };
}

@Connect(mapStateToProps)
export default class ChannelEditor extends Component<IChannelEditorProps, any> {
  @Override
  public render (): JSX.Element {
    const { channel, index } = this.props;

    return (
      <div className="channel-editor" id={ `${channel.id}` }>
        <div className="channel-editor-header">
          <h4 className="channel-title">Channel { channel.id }</h4>
          <label>Total notes:</label> <span>{ channel.size }</span>
        </div>

        <div className="channel-editor-body">
          <NotePreview channelIndex={ index } />
          <ShapeEditor channelIndex={ index } />
          <FillEditor channelIndex={ index } />
          <StrokeEditor channelIndex={ index } />
        </div>
      </div>
    );
  }
}
