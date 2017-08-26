import AudioCore from 'audio/AudioCore';
import FileLoader from 'FileLoader';
import ISound from 'audio/ISound';
import { EventManager, U } from 'Base/Core';
import { SoundState } from 'Audio/Constants';

export default class AudioFile implements ISound {
  private _analyserNode: AnalyserNode;
  private _audioBuffer: AudioBuffer;
  private _events: EventManager = new EventManager();
  private _filename: string;
  private _isLoaded: boolean = false;
  private _node: AudioBufferSourceNode;
  private _state: SoundState = SoundState.SOUND_STOPPED;

  public constructor (filename: string) {
    U.bindAll(this, 'play', '_onEnded');

    this._filename = filename;

    this._load();
  }

  public get name (): string {
    return this._filename;
  }

  public play (): void {
    if (!this._isLoaded) {
      this._events.on('load', this.play);

      return;
    }

    if (this._state === SoundState.SOUND_STOPPED || !this._node) {
      this._resetNode();
    }

    AudioCore.play(this._node);

    this._state = SoundState.SOUND_PLAYING;
  }

  public pause (): void {
    this._state = SoundState.SOUND_PAUSED;
  }

  public stop (): void {
    AudioCore.stop(this._node);

    this._state = SoundState.SOUND_STOPPED;
  }

  public listen (): void {

  }

  private _onEnded (): void {
    this._state = SoundState.SOUND_STOPPED;
  }

  private async _load (): Promise<void> {
    const audioData: ArrayBuffer = await FileLoader.urlToArrayBuffer(this._filename);

    AudioCore.decodeAudioData(audioData, (audioBuffer: AudioBuffer) => {
      this._audioBuffer = audioBuffer;
      this._isLoaded = true;

      this._events.trigger('load');
    });
  }

  private _resetNode (): void {
    this._node = AudioCore.createBufferSource();
    this._node.buffer = this._audioBuffer;

    this._node.addEventListener('ended', this._onEnded);
  }
}
