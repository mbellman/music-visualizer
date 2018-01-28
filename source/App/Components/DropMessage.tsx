import '@styles/DropMessage.less';

import { h, Component } from 'preact';

const DropMessage = () => {
  return (
    <div className="drop-message">
      <div className="box">Drag and drop a MIDI or audio file here!</div>
    </div>
  );
};

export default DropMessage;
