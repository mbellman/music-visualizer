import AppUI from 'GUI/UIs/AppUI';
import VisualizerUI from 'GUI/UIs/VisualizerUI';
import { $, IQuery } from 'Base/Core';

export default class App {
  private ui: { [element: string]: IQuery } = {};

  public start (): void {
    const $body = $('body').html(AppUI.template);

    this._bindUI();
    this._bindHandlers();

    VisualizerUI.initialize();
  }

  private _bindUI (): void {
    this.ui.$visualizer = $('.visualizer-container canvas');
    this.ui.$fileInput = $('input#file-input');
  }

  private _bindHandlers (): void {
    this.ui.$visualizer
      .on('drop', VisualizerUI.onFileDrop)
      .on('drop dragover', (e) => e.preventDefault());

    this.ui.$fileInput.on('change', AppUI.onFileInputChange);
  }
}
