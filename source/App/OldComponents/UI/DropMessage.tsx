import 'App/Styles/DropMessage.less';
import { h, Component } from 'preact';
import { Override } from 'Base/Core';

export default class DropMessage extends Component<any, any> {
  @Override
  public render (): JSX.Element {
    return (
      <div class="drop-message">
        <div class="box">Drag and drop a MIDI or audio file here!</div>
      </div>
    );
  }
}
