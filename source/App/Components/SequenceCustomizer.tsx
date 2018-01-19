import 'App/Styles/SequenceCustomizer.less';
import Channel from 'AppCore/MIDI/Channel';
import ChannelCustomizer from 'App/Components/ChannelCustomizer';
import Sequence from 'AppCore/MIDI/Sequence';
import { IChannelCustomization, IMusicTrack } from 'App/State/Types';
import { h, Component } from 'preact';

interface ISequenceCustomizerProps {
  musicTrack: IMusicTrack;
}

export default class SequenceCustomizer extends Component<ISequenceCustomizerProps, any> {
  public render (): JSX.Element {
    const { sequence, sequenceCustomization } = this.props.musicTrack;

    return (
      <div className="sequence-customizer">
        <h3 class="sequence-title">{ sequence.name }</h3>
        <div class="channels">
          {
            [ ...sequence.channels() ].map((channel: Channel, index: number) => {
              // const channelCustomization: IChannelCustomization = sequenceCustomization.channelCustomizations[index];

              return (
                <ChannelCustomizer
                  channel={ channel }
                  // channelCustomization={ channelCustomization }
                />
              );
            })
          }
        </div>
      </div>
    );
  }
}
