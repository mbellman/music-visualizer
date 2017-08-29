import AudioFile from 'Audio/AudioFile';
import FileLoader from 'FileLoader';
import MusicVisualizerState from 'MusicVisualizerState';
import { SoundState } from 'Audio/Constants';
import { Store } from 'Base/Core';

export enum Signal {
  UPDATED_FILES
}

export async function uploadFile (store: Store<MusicVisualizerState>, file: File): Promise<void> {
  const blob: Blob = await FileLoader.fileToBlob(file);
  const url: string = URL.createObjectURL(blob);
  const filename: string = file.name;
  const audioFile: AudioFile = new AudioFile(url, filename);
  const { files } = store.getState().playlist;

  files.push(audioFile);

  store.update('playlist', { files });
}

export function playAudioFile (store: Store<MusicVisualizerState>, index: number): void {
  const audioFiles: AudioFile[] = store.getState().playlist.files;

  audioFiles.forEach((audioFile: AudioFile, i: number) => {
    if (audioFile.isPlaying) {
      audioFile.stop();
    } else if (i === index) {
      audioFile.play();
    }
  });
}
