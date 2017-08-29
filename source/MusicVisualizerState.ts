import AudioFile from 'Audio/AudioFile';

interface IPlaylist {
  files: AudioFile[];
}

export default class MusicVisualizerState {
  public playlist: IPlaylist = {
    files: []
  };
}
