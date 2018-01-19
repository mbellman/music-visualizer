import Sequence from 'AppCore/MIDI/Sequence';
import Visualizer from 'AppCore/Visualization/Visualizer';
import { h, Component } from 'preact';

interface IVisualizationProps {
  sequence: Sequence;
}

export default class Visualization extends Component<any, any> {
  public render (): JSX.Element {
    return (
      <div className="visualizer">
        <canvas></canvas>
      </div>
    );
  }
}
