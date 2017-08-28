import AudioFile from 'Audio/AudioFile';

export default class MusicVisualizerState {
  public audioFiles: AudioFile[] = [];

  public currentPlaying: any = {
    audioFile: null,
    index: null
  };
}
