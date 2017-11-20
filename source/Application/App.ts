import AppUI from 'Application/GUI/UIs/AppUI';
import CanvasUI from 'Application/GUI/UIs/CanvasUI';
import { $, IQuery } from 'Base/Core';

export default class App {
  private ui: { [element: string]: IQuery } = {};

  public start (): void {
    const $body = $('body').html(AppUI.template);

    this._bindUI();
    this._bindHandlers();

    CanvasUI.start();
  }

  private _bindUI (): void {
    this.ui.$app = $('.app');
    this.ui.$fileInput = $('input#file-input');
  }

  private _bindHandlers (): void {
    this.ui.$app
      .on('drop', AppUI.onFileDrop)
      .on('drop dragover', (e) => e.preventDefault());

    this.ui.$fileInput.on('change', AppUI.onFileInputChange);
  }
}
