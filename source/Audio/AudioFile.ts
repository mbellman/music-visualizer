import AudioCore from 'audio/AudioCore';
import FileLoader from 'AppBase/FileLoader';
import ISound from 'audio/ISound';
import { EventManager, Utils } from 'Base/Core';
import { SoundState } from 'Audio/Constants';

enum AudioEvent {
  LOADED
}

export default class AudioFile implements ISound {
  private _analyserNode: AnalyserNode;
  private _audioBuffer: AudioBuffer;
  private _events: EventManager = new EventManager();
  private _isLoaded: boolean = false;
  private _name: string;
  private _node: AudioBufferSourceNode;
  private _state: SoundState = SoundState.SOUND_STOPPED;
  private _url: string;

  public constructor (url: string, name: string) {
    Utils.bindAll(this, 'play', '_onEnded');

    this._url = url;
    this._name = name;

    this._load();
  }

  public get name (): string {
    return this._name;
  }

  public get isPlaying (): boolean {
    return this._state === SoundState.SOUND_PLAYING;
  }

  public play (): void {
    if (!this._isLoaded) {
      this._events.on(AudioEvent.LOADED, this.play);

      return;
    }

    if (this._state === SoundState.SOUND_STOPPED || !this._node) {
      this._resetNode();
    }

    if (this._state !== SoundState.SOUND_PLAYING) {
      AudioCore.play(this._node);

      this._state = SoundState.SOUND_PLAYING;
    }
  }

  public pause (): void {
    this._state = SoundState.SOUND_PAUSED;
  }

  public stop (): void {
    AudioCore.stop(this._node);

    this._state = SoundState.SOUND_STOPPED;
  }

  private _onEnded (): void {
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
