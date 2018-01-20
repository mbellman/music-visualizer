import AudioFile from 'Audio/AudioFile';
import FileLoader from 'AppCore/FileLoader';
import Sequence from 'AppCore/MIDI/Sequence';
import Store from 'App/State/Store';
import { ActionTypes } from 'App/State/ActionTypes';
import {  } from 'App/State/Types';

export default class Manager {
  public static async uploadFile (file: File): Promise<void> {
    const blob: Blob = await FileLoader.fileToBlob(file);
    const url: string = URL.createObjectURL(blob);
    const audioFile: AudioFile = new AudioFile(url, file.name);

    /*
    Store.dispatch({
      type: ActionTypes.SET_AUDIO_FILE,
      audioFile
    });
    */

    URL.revokeObjectURL(url);
  }
}
