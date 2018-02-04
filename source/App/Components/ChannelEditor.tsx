import Channel from '@core/MIDI/Channel';
import FillEditor from '@components/FillEditor';
import GlowEditor from '@components/GlowEditor';
import NotePreview from '@components/NotePreview';
import ShapeEditor from '@components/ShapeEditor';
import StrokeEditor from '@components/StrokeEditor';
import { Component, h } from 'preact';
import { Connect } from '@components/Toolkit/Decorators';
import { Dispatch } from 'redux';
import { IAppState } from '@state/Types';
import { Method, Override } from '@base';
import '@styles/ChannelEditor.less';
import { ActionCreators } from '@state/ActionCreators';

interface IChannelEditorPropsFromState {
  channel?: Channel;
}

interface IChannelEditorPropsFromDispatch {
  randomizeChannel?: Method<any>;
}

interface IChannelEditorProps extends IChannelEditorPropsFromState, IChannelEditorPropsFromDispatch {
  index: number;
}

function mapStateToProps ({ selectedPlaylistTrack }: IAppState, { index }: IChannelEditorProps): IChannelEditorPropsFromState {
  const { sequence } = selectedPlaylistTrack;

  return {
    channel: sequence.getChannel(index)
  };
}

function mapDispatchToProps (dispatch: Dispatch<IAppState>, { index }: IChannelEditorProps): IChannelEditorPropsFromDispatch {
  const { randomizeChannel } = ActionCreators;

  return {
    randomizeChannel: () => {
      dispatch(randomizeChannel(index));
    }
  };
}

@Connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class ChannelEditor extends Component<IChannelEditorProps, any> {
  @Override
  public render (): JSX.Element {
    const { channel, index } = this.props;

    return (
      <div className="channel-editor" id={ `${channel.id}` }>
        <div className="channel-editor-header">
          <h4 className="channel-title">Channel { channel.id }</h4>
          <label>Total notes:</label> <span>{ channel.size }</span>

          <input
            type="button"
            className="randomize-button"
            value="Randomize"
            onClick={ this.props.randomizeChannel }
          />
        </div>

        <div className="channel-editor-body">
          <NotePreview channelIndex={ index } />
          <ShapeEditor channelIndex={ index } />
          <FillEditor channelIndex={ index } />
          <StrokeEditor channelIndex={ index } />
          <GlowEditor channelIndex={ index } />
        </div>
      </div>
    );
  }
}
