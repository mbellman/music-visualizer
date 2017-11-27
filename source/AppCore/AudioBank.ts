import AudioFile from 'Audio/AudioFile';
import FileLoader from 'AppCore/FileLoader';
import { SoundState } from 'Audio/Constants';

export default class AudioBank {
  private static _files: AudioFile[] = [];

  private static get _currentlyPlayingIndex (): number {
    for (let i = 0; i < AudioBank._files.length; i++) {
      const audioFile: AudioFile = AudioBank._files[i];

      if (audioFile.isPlaying) {
        return i;
      }
    }

    return -1;
  }

  public static playAudioFile (index: number): void {
    AudioBank._files.forEach((audioFile: AudioFile, i: number) => {
      if (audioFile.isPlaying) {
        audioFile.stop();
      }

      if (i === index) {
        audioFile.play();
      }
    });
  }

  public static playNext (): void {
    AudioBank.playAudioFile(AudioBank._currentlyPlayingIndex + 1);
  }

  public static playPrevious (): void {
    AudioBank.playAudioFile(AudioBank._currentlyPlayingIndex - 1);
  }

  public static async uploadFile (file: File): Promise<void> {
    const blob: Blob = await FileLoader.fileToBlob(file);
    const url: string = URL.createObjectURL(blob);
    const filename: string = file.name;
    const audioFile: AudioFile = new AudioFile(url, filename);

    AudioBank._files.push(audioFile);
  }
}
