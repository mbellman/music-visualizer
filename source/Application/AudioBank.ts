import AudioFile from 'Audio/AudioFile';
import { FileLoader } from 'Base/Core';
import { SoundState } from 'Audio/Constants';

export default class AudioBank {
  private static _files: AudioFile[] = [];

  public static async uploadFile (file: File): Promise<void> {
    const blob: Blob = await FileLoader.fileToBlob(file);
    const url: string = URL.createObjectURL(blob);
    const filename: string = file.name;
    const audioFile: AudioFile = new AudioFile(url, filename);

    this._files.push(audioFile);
  }

  public static playAudioFile (index: number): void {
    this._files.forEach((audioFile: AudioFile, i: number) => {
      if (audioFile.isPlaying) {
        audioFile.stop();
      } else if (i === index) {
        audioFile.play();
      }
    });
  }
}
