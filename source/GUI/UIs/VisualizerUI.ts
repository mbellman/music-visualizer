import 'GUI/Styles/VisualizerStyles.less';
import AudioBank from 'AppCore/AudioBank';
import Ball from 'AppCore/Visualization/Shapes/Ball';
import Bar from 'AppCore/Visualization/Shapes/Bar';
import Fill from 'AppCore/Visualization/Effects/Fill';
import Glow from 'AppCore/Visualization/Effects/Glow';
import MidiLoader from 'AppCore/MIDI/MidiLoader';
import Scroll from 'AppCore/Visualization/Effects/Scroll';
import Sequence from 'AppCore/MIDI/Sequence';
import Stroke from 'AppCore/Visualization/Effects/Stroke';
import Visualizer from 'AppCore/Visualization/Visualizer';
import { $, Utils } from 'Base/Core';

export default class VisualizerUI {
  public static template: string = `
    <div class="visualizer-container">
      <canvas></canvas>
    </div>
  `;

  private static _visualizer: Visualizer;

  public static initialize (): void {
    VisualizerUI._visualizer = new Visualizer($('.visualizer-container canvas')[0] as HTMLCanvasElement);

    VisualizerUI._visualizer.setSize(1190, 640);

    VisualizerUI._visualizer.define('Bar', (x: number, y: number, width: number, height: number) => {
      return [
        new Bar(x, y, width, height)
          .pipe(
            new Glow({ R: 0, G: 0, B: 255 }, 20)
              .delay(3000)
              .fadeIn(500)
              .fadeOut(500)
          )
          .pipe(new Stroke({ R: 0, G: 255, B: 255 }, 3))
          .pipe(
            new Fill({ R: 0, G: 255, B: 255 })
              .delay(3000)
          )
          .pipe(new Scroll())
      ];
    });

    VisualizerUI._visualizer.define('Ball', (x: number, y: number) => {
      return [
        new Ball(x, y, 10)
          .pipe(
            new Glow({ R: 255, G: 0, B: 0 }, 50)
              .delay(3000)
              .fadeOut(1000)
          )
          .pipe(new Fill({ R: 255, G: 200, B: 50 }))
          .pipe(new Scroll())
      ];
    });
  }

  public static async onFileDrop (event: DragEvent): Promise<void> {
    const file: File = event.dataTransfer.files[0];
    const extension: string = file.name.split('.').pop();

    if (extension === 'mid') {
      const sequence: Sequence = await MidiLoader.fileToSequence(file);

      VisualizerUI._visualize(sequence);
    } else {
      await AudioBank.uploadFile(file);

      AudioBank.playAudioFile(0);
    }
  }

  private static _visualize (sequence: Sequence): void {
    VisualizerUI._visualizer.configure({
      tempo: sequence.tempo
    });

    console.log(sequence);

    VisualizerUI._visualizer.run();

    const { width, height } = VisualizerUI._visualizer;
    const visualizerHeightRatio: number = height / 100;
    const heightToPitchRatio: number = 100 / 127;
    const spreadFactor: number = 1.5;
    const pixelsPerSecond: number = 60 * 0.01667 * sequence.tempo;
    const beatsPerSecond: number = sequence.tempo / 60;
    const pixelsPerBeat: number = pixelsPerSecond / beatsPerSecond;

    for (const channel of sequence.channels()) {
      for (const note of channel.notes()) {
        window.setTimeout(() => {
          const noteX: number = width;
          const noteY: number = (127 - note.pitch) * heightToPitchRatio * visualizerHeightRatio * spreadFactor - height / 3;

          VisualizerUI._visualizer.spawn('Bar', noteX, noteY, note.duration * pixelsPerBeat, 12);
        }, 1000 * note.delay / beatsPerSecond);
      }
    }
  }
}
