import 'App/Style.less';
import AudioBank from 'AppCore/AudioBank';
import MidiLoader from 'AppCore/MIDI/MidiLoader';
import Sequence from 'AppCore/MIDI/Sequence';
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
      <div class="settings"></div>
      <div class="visualizer-container">
        <canvas></canvas>
      </div>
    </div>
  `);

  /**
   * UI
   */
  const $fileInput: Query = $('input#file-input');
  const $visualizer: Query = $('.visualizer-container canvas');

  /**
   * Variables
   */
  const visualizer: Visualizer = new Visualizer($visualizer[0] as HTMLCanvasElement);

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

      visualizer.visualize(sequence);
    } else {
      await AudioBank.uploadFile(file);

      AudioBank.playAudioFile(0);
    }
  }

  /**
   * Initialization
   */
  $visualizer
    .on('drop', onFileDrop)
    .on('drop dragover', (e) => e.preventDefault());

  visualizer.setSize(1190, 640);
  visualizer.define('Bar', barFactory);
  visualizer.define('Ball', ballFactory);

  visualizer.configure({
    framerate: 60,
    speed: 80
  });
}
