import 'App/Styles/Options.less';
import Sequence from 'AppCore/MIDI/Sequence';
import { h, Component } from 'preact';

interface IOptionsProps {
  sequence: Sequence;
}

export default class Options extends Component<IOptionsProps, any> {
  public render (): JSX.Element {
    if (!this.props.sequence) {
      return <div className="options" />;
    }

    return (
      <div className="options">
        <h3 class="sequence-title">{ this.props.sequence.name }</h3>
        <div class="channels"></div>
      </div>
    );
  }
}
