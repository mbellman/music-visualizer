import AudioFile from 'Audio/AudioFile';
import FileLoader from 'FileLoader';
import MusicVisualizerState from 'MusicVisualizerState';
import { Store } from 'Base/Core';

export default class MusicVisualizerStore extends Store<MusicVisualizerState> {
  public constructor () {
    super(new MusicVisualizerState());
  }

  public async addFile (file: File): Promise<void> {
    const blob: Blob = await FileLoader.fileToBlob(file);
    const url: string = URL.createObjectURL(blob);
    const audioFile: AudioFile = new AudioFile(url);
    const { audioFiles } = super.getState().fileListContext;

    audioFiles.push(audioFile);

    super.update('fileListContext', { audioFiles });
  }

  public getAudioFiles (): AudioFile[] {
    return this.getState().fileListContext.audioFiles;
  }
}
