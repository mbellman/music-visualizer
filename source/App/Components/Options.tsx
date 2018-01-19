import Sequence from 'AppCore/MIDI/Sequence';
import { h, Component } from 'preact';

interface IProps {
  sequence: Sequence;
}

export default class Options extends Component<any, any> {
  public render (): JSX.Element {
    return (
      <div className="options">
        { }
      </div>
    );
  }
}
