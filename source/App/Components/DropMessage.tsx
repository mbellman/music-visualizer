import '@styles/DropMessage.less';

import { h, Component } from 'preact';

const DropMessage = () => {
  return (
    <div class="drop-message">
      <div class="box">Drag and drop a MIDI or audio file here!</div>
    </div>
  );
};

export default DropMessage;
