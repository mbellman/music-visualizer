import AudioCore from 'audio/AudioCore';
import FileLoader from 'FileLoader';
import ISound from 'audio/ISound';
import { EventManager } from 'Base/Core';

export default class AudioFile implements ISound {
  private _analyserNode: AnalyserNode;
  private _audioBuffer: AudioBuffer;
  private _events: EventManager = new EventManager();
  private _filename: string;
  private _isLoaded: boolean = false;
  private _node: AudioBufferSourceNode;

  public constructor (filename: string) {
    this._filename = filename;

    this._load();
  }

  public play (): void {
    if (!this._isLoaded) {
      this._events.on('load', () => this.play());

      return;
    }

    this._node = AudioCore.play(this._audioBuffer);
  }

  public pause (): void {
    // ...
  }

  public stop (): void {
    AudioCore.stop(this._node);
  }

  public listen (): void {

  }

  private async _load (): Promise<void> {
    const audioData: any = await FileLoader.arrayBufferFromUrl(this._filename);

    AudioCore.decode(audioData, (audioBuffer: AudioBuffer) => {
      this._audioBuffer = audioBuffer;
      this._isLoaded = true;

      this._events.trigger('load');
    });
  }
}
