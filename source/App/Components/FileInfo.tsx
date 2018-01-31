import AudioFile from '@core/Audio/AudioFile';
import Sequence from '@core/MIDI/Sequence';
import { h } from 'preact';
import '@styles/FileInfo.less';

interface INamedFile {
  name: string;
}

interface IFileInfoProps {
  label: string;
  file: INamedFile;
}

const FileInfo = ({ label, file }: IFileInfoProps) => {
  return (
    <div class="file-info">
      <label>{ label }:</label>
      <span key={ file ? file.name : '' } class="file-name">
        { file ? file.name : '-' }
      </span>
    </div>
  );
};

export default FileInfo;
