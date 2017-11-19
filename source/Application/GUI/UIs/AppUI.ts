import 'Application/GUI/Styles/AppStyles.less';
import AudioBank from 'Application/AudioBank';
import CanvasUI from 'Application/GUI/UIs/CanvasUI';
import SettingsUI from 'Application/GUI/UIs/SettingsUI';

export default class AppUI {
  public static template: string = `
    <input type="file" id="file-input" />
    <div class="app">
      ${SettingsUI.template}
      ${CanvasUI.template}
    </div>
  `;

  public static async onFileDrop (event: DragEvent): Promise<void> {
    const file: File = event.dataTransfer.files[0];

    await AudioBank.uploadFile(file);

    AudioBank.playAudioFile(0);
  }

  public static onFileInputChange (): void {

  }
}
