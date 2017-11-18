import GUI from 'Application/GUI/GUI';

export default class App {
  public start (): void {
    const gui: GUI = new GUI();

    gui.set(document.body);
  }
}
