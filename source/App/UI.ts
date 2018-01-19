import 'App/Style.less';
import AudioBank from 'App/State/AudioBank';
import Channel from 'AppCore/MIDI/Channel';
import MidiLoader from 'AppCore/MIDI/MidiLoader';
import Sequence from 'AppCore/MIDI/Sequence';
import SequenceOptions from 'App/State/SequenceOptions';
import Visualizer from 'AppCore/Visualization/Visualizer';
import { $ } from 'Base/Core';
import { barFactory, ballFactory } from 'App/ShapeFactories';
import { Query } from 'Base/DOM/Query';

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

  /**
   * Variables
   */
  let activeSequence: Sequence;
  const sequenceOptionsMap: Map<Sequence, SequenceOptions> = new Map();
  const visualizer: Visualizer = new Visualizer($visualizer.find('canvas')[0] as HTMLCanvasElement);

  /**
   * UI methods
   */
  function renderChannelOptions (channel: Channel): void {
    $options.find('.channels')
      .append(`
        <div class="channel" id="channel-${channel.id}">
          <canvas class="preview"></canvas>

          <div>
            <h4 class="title">Channel ${channel.id}</h4>
            <label>Total notes:</label> <span>${channel.size}</span>
          </div>

          <label>Shape:</label>
          <select class="shape-selector" id="${channel.id}">
            <option value="Bar">Bar</option>
            <option value="Ball">Ball</option>
          </select>

          <label>Effects:</label>
        </div>
      `);
  }

  function renderSequenceOptions (sequence: Sequence): void {
    activeSequence = sequence;

    sequenceOptionsMap.set(sequence, new SequenceOptions(sequence));

    $options.html(`
      <h3 class="sequence-title">${sequence.name}</h3>
      <div class="channels"></div>
    `);

    for (const channel of sequence.channels()) {
      renderChannelOptions(channel);
    }

    showSequenceOptions();
  }

  function showSequenceOptions (): void {
    $options.show();
    $visualizer.hide();
  }

  function showVisualizer (): void {
    $visualizer.show();
    $options.hide();
  }

  /**
   * Event handlers
   */
  function onChangeFileInput (): void {

  }

  async function onDropFile (e: DragEvent): Promise<void> {
    const file: File = e.dataTransfer.files[0];
    const extension: string = file.name.split('.').pop();

    if (extension === 'mid') {
      const sequence: Sequence = await MidiLoader.fileToSequence(file);

      renderSequenceOptions(sequence);
      // visualizer.visualize(sequence);
    } else {
      await AudioBank.uploadFile(file);

      AudioBank.playAudioFile(0);
    }
  }

  function onChangeShape (e: UIEvent): void {
    const target: Element = e.target as Element;
    // const selectedChannel: Channel = activeSequence.getChannel($(target).index());
    // const activeSequenceOptions: SequenceOptions = sequenceOptionsMap.get(activeSequence);
  }

  /**
   * Event bindings
   */
  $app
    .on('drop', onDropFile)
    .on('drop dragover', (e) => e.preventDefault());

  $app.on('change', 'select.shape-selector', onChangeShape);

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
