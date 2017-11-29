import 'GUI/Styles/AppStyles.less';
import SettingsUI from 'GUI/UIs/SettingsUI';
import VisualizerUI from 'GUI/UIs/VisualizerUI';

export default class AppUI {
  public static template: string = `
    <input type="file" id="file-input" />
    <div class="app">
      ${SettingsUI.template}
      ${VisualizerUI.template}
    </div>
  `;

  public static onFileInputChange (): void {

  }
}
