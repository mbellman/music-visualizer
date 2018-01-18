import 'App/Style.less';
import AudioBank from 'AppCore/AudioBank';
import MidiLoader from 'AppCore/MIDI/MidiLoader';
import Sequence from 'AppCore/MIDI/Sequence';
import Visualizer from 'AppCore/Visualization/Visualizer';
import { $ } from 'Base/Core';
import { barFactory, ballFactory } from 'App/ShapeFactories';
import { Query } from 'Base/DOM/Query';
import Channel from 'AppCore/MIDI/Channel';

export function main (): void {
  /**
   * Layout initialization
   */
  $('body').html(`
    <input type="file" id="file-input" />
    <div class="app">
      <div class="options"></div>
      <div class="visualizer">
        <canvas></canvas>
      </div>
    </div>
  `);

  /**
   * UI
   */
  const $app: Query = $('.app');
  const $fileInput: Query = $('input#file-input');
  const $options: Query = $('.options');
  const $visualizer: Query = $('.visualizer');
  const $visualizerCanvas: Query = $('.visualizer > canvas');

  /**
   * Variables
   */
  const visualizer: Visualizer = new Visualizer($visualizerCanvas[0] as HTMLCanvasElement);

  /**
   * Various UI methods
   */
  function addChannelOptions (channel: Channel): void {
    $options.find('.channels')
      .append(`
        <div class="channel" id="channel-${channel.id}">
          <canvas class="preview"></canvas>

          <div>
            <h4 class="title">Channel ${channel.id}</h4>
            <label>Total notes:</label> <span>${channel.size}</span>
          </div>

          <label>Shape:</label>
          <select id="${channel.id}">
            <option value="Bar">Bar</option>
            <option value="Ball">Ball</option>
          </select>

          <label>Effects:</label>
        </div>
      `);
  }

  function showOptions (): void {
    $options.show();
    $visualizer.hide();
  }

  function loadSequenceOptions (sequence: Sequence): void {
    $options.html(`
      <h3 class="sequence-title">${sequence.name}</h3>
      <div class="channels"></div>
    `);

    for (const channel of sequence.channels()) {
      addChannelOptions(channel);
    }

    showOptions();
  }

  function showVisualizer (): void {
    $visualizer.show();
    $options.hide();
  }

  /**
   * Event handlers
   */
  function onFileInputChange (): void {

  }

  async function onFileDrop (event: DragEvent): Promise<void> {
    const file: File = event.dataTransfer.files[0];
    const extension: string = file.name.split('.').pop();

    if (extension === 'mid') {
      const sequence: Sequence = await MidiLoader.fileToSequence(file);

      loadSequenceOptions(sequence);
      // visualizer.visualize(sequence);
    } else {
      await AudioBank.uploadFile(file);

      AudioBank.playAudioFile(0);
    }
  }

  /**
   * Event bindings
   */
  $app
    .on('drop', onFileDrop)
    .on('drop dragover', (e) => e.preventDefault());

  /**
   * Initialization
   */
  $options.hide();

  visualizer.setSize(1190, 640);
  visualizer.define('Bar', barFactory);
  visualizer.define('Ball', ballFactory);

  visualizer.configure({
    framerate: 60,
    speed: 100
  });
}
