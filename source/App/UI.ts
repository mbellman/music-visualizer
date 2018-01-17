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
    $options
      .find('.channels')
      .append(`
        <div class="channel">
          <label class="name">${channel.size}</label>
        </div>
      `);
  }

  function showOptions (): void {
    $options.show();
    $visualizer.hide();
  }

  function loadSequenceOptions (sequence: Sequence): void {
    $options.html(`
      <h4 class="name">${sequence.name}</h4>
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

      sequence.name = file.name;

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
  $visualizerCanvas
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
    speed: 80
  });
}
