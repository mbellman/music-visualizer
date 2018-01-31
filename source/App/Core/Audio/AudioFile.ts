import AudioCore from '@core/Audio/AudioCore';
import FileLoader from '@core/FileLoader';
import ISound from '@core/Audio/ISound';
import { AudioEvent, SoundState } from '@core/Audio/Constants';
import { Bind, Implementation, EventManager } from '@base';

export default class AudioFile implements ISound {
  public readonly name: string;
  private _analyserNode: AnalyserNode;
  private _audioBuffer: AudioBuffer;
  private _elapsedTime: number = 0;
  private _events: EventManager = new EventManager();
  private _isLoaded: boolean = false;
  private _lastPlayStartTime: number = 0;
  private _node: AudioBufferSourceNode;
  private _state: SoundState = SoundState.SOUND_STOPPED;
  private _url: string;

  public constructor (url: string, name: string) {
    this._url = url;
    this.name = name;

    this._load();
  }

  public get isPlaying (): boolean {
    return this._state === SoundState.SOUND_PLAYING;
  }

  @Bind
  @Implementation
  public play (): void {
    if (!this._isLoaded) {
      this._events.on(AudioEvent.LOADED, this.play);

      return;
    }

    if (this._state === SoundState.SOUND_STOPPED || !this._node) {
      this._resetNode();
    }

    if (this._state !== SoundState.SOUND_PLAYING) {
      AudioCore.play(this._node, this._elapsedTime);

      this._lastPlayStartTime = Date.now();
      this._state = SoundState.SOUND_PLAYING;
    }
  }

  @Implementation
  public pause (): void {
    AudioCore.stop(this._node);

    this._resetNode();

    this._elapsedTime += (Date.now() - this._lastPlayStartTime) / 1000;
    this._state = SoundState.SOUND_PAUSED;
  }

  @Implementation
  public restart (): void {
    this.stop();
    this.play();
  }

  @Implementation
  public stop (): void {
    if (this._state === SoundState.SOUND_PLAYING) {
      AudioCore.stop(this._node);
    }

    this._onEnded();
  }

  @Bind
  private _onEnded (): void {
    this._elapsedTime = 0;
    this._lastPlayStartTime = 0;
    this._state = SoundState.SOUND_STOPPED;
  }

  private async _load (): Promise<void> {
    const audioData: ArrayBuffer = await FileLoader.urlToArrayBuffer(this._url);

    AudioCore.decodeAudioData(audioData, (audioBuffer: AudioBuffer) => {
      this._audioBuffer = audioBuffer;
      this._isLoaded = true;

      this._events.trigger(AudioEvent.LOADED);
    });
  }

  /**
   * The limited lifetime of WebAudio nodes requires that we
   * recreate a node any time we want to replay the audio.
   */
  private _resetNode (): void {
    if (this._node) {
      this._node.removeEventListener('ended', this._onEnded);
    }

    this._node = AudioCore.createBufferSource();
    this._node.buffer = this._audioBuffer;

    this._node.addEventListener('ended', this._onEnded);
  }
}
