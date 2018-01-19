import AudioFile from 'Audio/AudioFile';
import FileLoader from 'AppCore/FileLoader';
import Sequence from 'AppCore/MIDI/Sequence';
import Store from 'App/State/Store';
import { IMusicTrack } from 'App/State/Types';
import { SoundState } from 'Audio/Constants';

export default class MusicBank {
  public static addSequence (sequence: Sequence): void {
    const { currentMusicTrackIndex, musicTracks } = Store.getState();

    Store.setState({
      currentMusicTrackIndex: musicTracks.length,
      musicTracks: [ ...musicTracks, { sequence } ]
    });
  }

  public static getCurrentMusicTrack (): IMusicTrack {
    const { currentMusicTrackIndex, musicTracks } = Store.getState();

    return musicTracks[currentMusicTrackIndex] || {};
  }

  public static async uploadFile (file: File): Promise<void> {
    const blob: Blob = await FileLoader.fileToBlob(file);
    const url: string = URL.createObjectURL(blob);
    const audioFile: AudioFile = new AudioFile(url, file.name);
    const { musicTracks } = Store.getState();

    Store.setState({
      musicTracks: [ ...musicTracks, { audioFile } ]
    });

    URL.revokeObjectURL(url);
  }
}
