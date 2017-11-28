import 'GUI/Styles/AppStyles.less';
import AudioBank from 'AppCore/AudioBank';
import VisualizerUI from 'GUI/UIs/VisualizerUI';
import SettingsUI from 'GUI/UIs/SettingsUI';
import MidiLoader from 'AppCore/MIDI/MidiLoader';

export default class AppUI {
  public static template: string = `
    <input type="file" id="file-input" />
    <div class="app">
      ${SettingsUI.template}
      ${VisualizerUI.template}
    </div>
  `;

  public static async onFileDrop (event: DragEvent): Promise<void> {
    const file: File = event.dataTransfer.files[0];
    const extension: string = file.name.split('.').pop();

    if (extension === 'mid') {
      MidiLoader.fileToSequence(file);
    } else {
      await AudioBank.uploadFile(file);

      AudioBank.playAudioFile(0);
    }
  }

  public static onFileInputChange (): void {

  }
}
