import AudioFile from 'Audio/AudioFile';
import FileLoader from 'FileLoader';
import MusicVisualizerState from 'MusicVisualizerState';
import { Store } from 'Base/Core';

export enum Signal {
  UPDATED_FILES
}

export async function uploadFile (store: Store<MusicVisualizerState>, file: File): Promise<void> {
  const blob: Blob = await FileLoader.fileToBlob(file);
  const url: string = URL.createObjectURL(blob);
  const filename: string = file.name;
  const audioFile: AudioFile = new AudioFile(url, filename);
  const { audioFiles } = store.getState();

  audioFiles.push(audioFile);

  store.update('audioFiles', audioFiles);
}

export function getAudioFiles (store: Store<MusicVisualizerState>): AudioFile[] {
  return store.getState().audioFiles;
}

export function playAudioFile (store: Store<MusicVisualizerState>, index: number): void {
  const audioFiles: AudioFile[] = getAudioFiles(store);

  audioFiles[index].play();
}
