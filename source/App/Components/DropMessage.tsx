import { h } from 'preact';
import '@styles/DropMessage.less';

const DropMessage = () => {
  return (
    <div className="drop-message">
      <div className="box">Drag and drop a MIDI or audio file here!</div>
    </div>
  );
};

export default DropMessage;
