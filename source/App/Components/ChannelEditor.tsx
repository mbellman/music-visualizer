import '@styles/ChannelEditor.less';

import Canvas, { DrawSetting } from 'Graphics/Canvas';
import Channel from '@core/MIDI/Channel';
import FillEditor from '@components/FillEditor';
import StrokeEditor from '@components/StrokeEditor';
import { h, Component } from 'preact';
import { IAppState } from '@state/Types';
import { Bind, Extension, Implementation, Override } from '@base';
import { IFillTemplate, IStrokeTemplate, IEffectTemplate, IShapeTemplate, ShapeTypes } from '@state/VisualizationTypes';
import Sequence from '@core/MIDI/Sequence';
import { Connect } from '@components/Toolkit/Decorators';
import ShapeEditor from '@components/ShapeEditor';
import { Selectors } from '@state/Selectors';
import NotePreview from '@components/NotePreview';

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
